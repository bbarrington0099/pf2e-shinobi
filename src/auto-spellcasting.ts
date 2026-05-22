import { MODULE_ID } from "./constants.js";
import { logger } from "./logger.js";

/**
 * Auto-provisioning of PF2e spellcasting entries for chakra classes.
 *
 * When a player drags one of our Specialization classes onto a character
 * actor, the actor needs at least one `spellcastingEntry` with the
 * `chakra` tradition for jutsu (and the Charge Chakra focus spell) to
 * route correctly. Foundry does not create this automatically; the
 * user-facing alternative is "remember to add a Chakra spellcasting
 * entry by hand, set its tradition, ability, and proficiency."
 *
 * This module hooks `createItem` and provisions the entries the first
 * time a chakra class lands on an actor, reading the class's
 * `flags.pf2e-shinobi.spellcastingProgression` and `chakraKeyAbility`
 * to decide what to create.
 *
 * Two entries are produced for caster classes:
 *   - A `focus` entry that holds Charge Chakra and any future focus jutsu.
 *   - A `prepared` slot entry that holds rank-1+ jutsu.
 *
 * Non-caster classes (Taijutsu, Weapon Master) get only the focus entry
 * since they have no slot progression.
 *
 * Slot counts in the slot entry start at zero. We deliberately do not
 * auto-populate spell-slot maxes because the player will continue to
 * level up over the campaign and the PF2e Leveler / sheet handles slot
 * accounting more reliably than a one-shot create hook.
 */

type SpellcastingProgression = "full" | "half" | "none";
type AbilitySlug = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface ChakraClassFlags {
  spellcastingProgression: SpellcastingProgression;
  chakraKeyAbility: AbilitySlug;
}

interface ItemLike {
  id?: string;
  name?: string;
  type?: string;
  flags?: {
    [scope: string]: Record<string, unknown> | undefined;
  };
  parent?: ActorLike | null;
  system?: {
    slug?: string;
  };
}

interface SpellcastingEntryLike {
  id?: string;
  type?: string;
  system?: {
    tradition?: { value?: string };
    prepared?: { value?: string };
  };
}

interface ActorLike {
  id?: string;
  type?: string;
  itemTypes?: {
    spellcastingEntry?: SpellcastingEntryLike[];
  };
  createEmbeddedDocuments?: (type: string, data: Record<string, unknown>[]) => Promise<unknown>;
}

/**
 * Numeric slot template, one bucket per rank. Created with zeros so the
 * player still fills in their spell-slot table; the rank-by-rank UI
 * stays usable.
 */
function emptySlots(): Record<string, { max: number; value: number; prepared: unknown[] }> {
  const result: Record<string, { max: number; value: number; prepared: unknown[] }> = {};
  for (let r = 0; r <= 10; r += 1) {
    result[`slot${r}`] = { max: 0, value: 0, prepared: [] };
  }
  return result;
}

/**
 * Pure builder for the JSON document of a chakra spellcasting entry.
 *
 * `kind: "focus"` produces an entry that hosts focus spells like Charge
 * Chakra. `kind: "slot"` produces a prepared entry for regular slot jutsu.
 *
 * Exported for direct unit-testing.
 */
export function buildChakraEntrySpec(
  kind: "focus" | "slot",
  ability: AbilitySlug,
  classSlug: string,
): Record<string, unknown> {
  const isFocus = kind === "focus";
  const name = isFocus ? "Chakra (Focus)" : "Chakra (Spell Slots)";

  return {
    name,
    type: "spellcastingEntry",
    img: isFocus
      ? "icons/magic/symbols/runes-marked-blue.webp"
      : "icons/magic/symbols/runes-orb-blue.webp",
    flags: {
      [MODULE_ID]: {
        autoProvisioned: true,
        kind,
        sourceClass: classSlug,
      },
    },
    system: {
      prepared: { value: isFocus ? "focus" : "prepared" },
      tradition: { value: "chakra" },
      ability: { value: ability },
      proficiency: { slug: "", value: 1 },
      spelldc: { value: 0 },
      slots: emptySlots(),
      autoHeightenLevel: { value: null },
    },
  };
}

/**
 * Inspect a class Item and return the M3.5 chakra flags if present.
 */
export function readChakraFlags(item: ItemLike): ChakraClassFlags | null {
  const moduleFlags = item.flags?.[MODULE_ID];
  if (!moduleFlags || typeof moduleFlags !== "object") return null;

  const flags = moduleFlags as Partial<ChakraClassFlags>;
  const progression = flags.spellcastingProgression;
  const ability = flags.chakraKeyAbility;

  if (progression !== "full" && progression !== "half" && progression !== "none") return null;
  if (!ability || !["str", "dex", "con", "int", "wis", "cha"].includes(ability)) return null;

  return { spellcastingProgression: progression, chakraKeyAbility: ability };
}

/**
 * Returns the list of entry specs that should exist on the actor for
 * the given class. Pure / testable.
 */
export function plannedChakraEntries(
  flags: ChakraClassFlags,
  classSlug: string,
): Record<string, unknown>[] {
  const entries: Record<string, unknown>[] = [
    buildChakraEntrySpec("focus", flags.chakraKeyAbility, classSlug),
  ];
  if (flags.spellcastingProgression !== "none") {
    entries.push(buildChakraEntrySpec("slot", flags.chakraKeyAbility, classSlug));
  }
  return entries;
}

/**
 * For a given actor, return the chakra entry kinds that already exist
 * (so we can skip them).
 */
function existingChakraEntryKinds(actor: ActorLike): Set<"focus" | "slot"> {
  const present = new Set<"focus" | "slot">();
  const entries = actor.itemTypes?.spellcastingEntry ?? [];
  for (const entry of entries) {
    const tradition = entry.system?.tradition?.value;
    if (tradition !== "chakra") continue;
    const prepared = entry.system?.prepared?.value;
    if (prepared === "focus") present.add("focus");
    else present.add("slot");
  }
  return present;
}

async function ensureChakraEntries(item: ItemLike): Promise<void> {
  const actor = item.parent;
  if (!actor || actor.type !== "character") return;
  if (item.type !== "class") return;

  const flags = readChakraFlags(item);
  if (!flags) return;

  if (!actor.createEmbeddedDocuments) return;

  const classSlug = item.system?.slug ?? item.name?.toLowerCase().replace(/\s+/g, "-") ?? "chakra";
  const existing = existingChakraEntryKinds(actor);
  const planned = plannedChakraEntries(flags, classSlug);
  const missing = planned.filter((spec) => {
    const specFlags = (spec.flags as Record<string, Record<string, unknown>> | undefined)?.[
      MODULE_ID
    ];
    const kind = specFlags?.kind as "focus" | "slot" | undefined;
    return kind && !existing.has(kind);
  });

  if (missing.length === 0) {
    logger.debug(`Chakra entries already present on actor ${actor.id ?? "?"}; nothing to do.`);
    return;
  }

  logger.info(
    `Provisioning ${missing.length} chakra spellcasting entr${missing.length === 1 ? "y" : "ies"} for ${item.name ?? "class"} on actor ${actor.id ?? "?"}.`,
  );
  await actor.createEmbeddedDocuments("Item", missing);
}

/**
 * Registers the createItem hook. Invoked from `Hooks.once("ready", ...)`
 * so that the PF2e system has finished its own boot.
 */
export function registerAutoSpellcasting(): void {
  Hooks.on("createItem", (item: unknown) => {
    void ensureChakraEntries(item as ItemLike).catch((err: unknown) => {
      logger.error("ensureChakraEntries failed:", err);
    });
  });
  logger.debug("Auto-spellcasting hook registered.");
}
