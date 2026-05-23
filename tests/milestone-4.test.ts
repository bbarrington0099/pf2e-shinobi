import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { PACKS } from "../scripts/packs.config";

interface CompendiumDoc {
  _id?: string;
  name: string;
  type: string;
  folder?: string | null;
  system?: Record<string, unknown>;
}

interface SpellSystem {
  level?: { value?: number };
  traits?: { traditions?: string[]; value?: string[] };
}

interface EffectSystem {
  duration?: { unit?: string; value?: number };
  traits?: { value?: string[] };
}

const REPO_ROOT = resolve(__dirname, "..");

const SPELL_FOLDER_NAMES: Record<string, string> = {
  FldSAcademyCntrp: "Academy Cantrips",
  FldSNinjutsuJtsu: "Ninjutsu",
  FldSGenjutsuJtsu: "Genjutsu",
  FldSMedicalJtsu0: "Medical Jutsu",
  FldSSummoningJts: "Summoning Jutsu",
  FldSFuinjutsuJts: "Fūinjutsu",
  FldSSpecialKkgnk: "Special / Kekkei Genkai",
  FldSFocusChakra0: "Focus / Chakra Management",
};

function loadPackDocs(packName: string): Map<string, CompendiumDoc> {
  const pack = PACKS.find((p) => p.name === packName);
  if (!pack) throw new Error(`Unknown pack ${packName}`);
  const dir = join(REPO_ROOT, pack.sourceDir);
  const docs = new Map<string, CompendiumDoc>();
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".json") || name === "_folders.json") continue;
    const full = join(dir, name);
    if (!statSync(full).isFile()) continue;
    const parsed = JSON.parse(readFileSync(full, "utf8")) as CompendiumDoc;
    if (parsed._id) docs.set(parsed._id, parsed);
  }
  return docs;
}

describe("Milestone 4: spells and spell-effects", () => {
  const spells = loadPackDocs("spells");
  const effects = loadPackDocs("spell-effects");

  test("ships 82 spells total (79 new jutsu + 3 Charge Chakra variants) and 12 spell-effects", () => {
    expect(spells.size).toBe(82);
    expect(effects.size).toBe(12);
  });

  test("every spell carries the chakra tradition", () => {
    for (const [id, doc] of spells) {
      const traits = ((doc.system ?? {}) as SpellSystem).traits;
      const traditions = traits?.traditions ?? [];
      if (!traditions.includes("chakra")) {
        throw new Error(`Spell ${id} (${doc.name}) does not include the chakra tradition.`);
      }
    }
  });

  test("every spell carries the chakra trait in system.traits.value", () => {
    for (const [id, doc] of spells) {
      const traits = ((doc.system ?? {}) as SpellSystem).traits;
      const value = traits?.value ?? [];
      if (!value.includes("chakra")) {
        throw new Error(`Spell ${id} (${doc.name}) does not include the chakra trait.`);
      }
    }
  });

  test("every spell is filed into one of the 8 known school folders", () => {
    for (const [id, doc] of spells) {
      const folder = (doc as { folder?: string }).folder;
      if (!folder) throw new Error(`Spell ${id} has no folder.`);
      if (!Object.prototype.hasOwnProperty.call(SPELL_FOLDER_NAMES, folder)) {
        throw new Error(`Spell ${id} references unknown folder ${folder}.`);
      }
    }
  });

  test("academy cantrips and Charge Chakra variants land in their expected folders", () => {
    const academyIds = [
      "SpllAcHengeJtsu0",
      "SpllAcBunshinJts",
      "SpllAcKawarmCnt0",
      "SpllAcThrowTech0",
      "SpllAcTreeWalk00",
    ];
    for (const id of academyIds) {
      const doc = spells.get(id);
      expect(doc).toBeDefined();
      expect((doc as { folder?: string }).folder).toBe("FldSAcademyCntrp");
    }

    const focusIds = ["SpllChargChakra0", "SpllChrgChak2nd0", "SpllChrgChak3rd0"];
    for (const id of focusIds) {
      const doc = spells.get(id);
      expect(doc).toBeDefined();
      expect((doc as { folder?: string }).folder).toBe("FldSFocusChakra0");
    }
  });

  test("spell-school distribution matches the M4 design budget", () => {
    const distribution = new Map<string, number>();
    for (const doc of spells.values()) {
      const folder = (doc as { folder?: string }).folder ?? "(none)";
      distribution.set(folder, (distribution.get(folder) ?? 0) + 1);
    }
    expect(distribution.get("FldSAcademyCntrp")).toBe(5);
    expect(distribution.get("FldSNinjutsuJtsu")).toBe(37);
    expect(distribution.get("FldSGenjutsuJtsu")).toBe(10);
    expect(distribution.get("FldSMedicalJtsu0")).toBe(8);
    expect(distribution.get("FldSSummoningJts")).toBe(6);
    expect(distribution.get("FldSFuinjutsuJts")).toBe(6);
    expect(distribution.get("FldSSpecialKkgnk")).toBe(7);
    expect(distribution.get("FldSFocusChakra0")).toBe(3);
  });

  test("spell ranks span 1 through 10 with at least one entry at every rank", () => {
    const ranks = new Set<number>();
    for (const doc of spells.values()) {
      const level = ((doc.system ?? {}) as SpellSystem).level?.value;
      if (typeof level === "number") ranks.add(level);
    }
    for (const rank of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      if (!ranks.has(rank)) {
        throw new Error(`No spell at rank ${rank}; M4 expects coverage 1\u201310.`);
      }
    }
  });

  test("S-rank / unique spells (Tsukuyomi, Kotoamatsukami, Hiraishin, Edo Tensei, Reaper Death Seal, Tailed Beast Bomb) are flagged rare or unique", () => {
    const restrictedIds = [
      "SpllGnTsukuyomi0",
      "SpllGnKotoamtskm",
      "SpllSpHiraishin0",
      "SpllKsEdoTensei0",
      "SpllFjReaprDeath",
      "SpllSpTBeastBomb",
    ];
    for (const id of restrictedIds) {
      const doc = spells.get(id);
      expect(doc).toBeDefined();
      const traits = ((doc?.system ?? {}) as { traits?: { rarity?: string } }).traits;
      const rarity = traits?.rarity ?? "common";
      expect(["rare", "unique"]).toContain(rarity);
    }
  });

  test("every spell-effect declares a duration object with a valid unit", () => {
    const validUnits = new Set(["rounds", "minutes", "hours", "days", "encounter", "unlimited"]);
    for (const [id, doc] of effects) {
      const duration = ((doc.system ?? {}) as EffectSystem).duration;
      expect(duration).toBeDefined();
      if (!duration?.unit || !validUnits.has(duration.unit)) {
        throw new Error(`Effect ${id} has invalid duration unit: ${duration?.unit ?? "(none)"}`);
      }
    }
  });

  test("spell-effect _id prefixes follow the Effc scheme", () => {
    for (const id of effects.keys()) {
      expect(id).toMatch(/^Effc[A-Za-z0-9]{12}$/);
    }
  });

  test("spell-effect description text actually references its originating spell via @UUID", () => {
    for (const [id, doc] of effects) {
      const value =
        ((doc.system ?? {}) as { description?: { value?: string } }).description?.value ?? "";
      const hasReference = /@UUID\[Compendium\.pf2e-shinobi\.spells\.Item\./.test(value);
      if (!hasReference) {
        throw new Error(
          `Effect ${id} (${doc.name}) does not link to a parent spell via @UUID in its description.`,
        );
      }
    }
  });
});
