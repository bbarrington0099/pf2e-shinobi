import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { PACKS } from "../scripts/packs.config";
import {
  buildChakraEntrySpec,
  plannedChakraEntries,
  readChakraFlags,
} from "../src/auto-spellcasting";

interface CompendiumDoc {
  _id?: string;
  name: string;
  type: string;
  flags?: Record<string, Record<string, unknown> | undefined>;
  system?: Record<string, unknown>;
}

interface ClassSystem {
  items?: Record<string, { uuid?: string; level?: number; name?: string }>;
  keyAbility?: { value: string[] };
}

interface SpellSystem {
  level?: { value?: number };
  traits?: { traditions?: string[]; value?: string[] };
}

interface FeatSystem {
  level?: { value?: number };
  category?: string;
  rules?: Array<{ key: string; uuid?: string }>;
}

const REPO_ROOT = resolve(__dirname, "..");
const MODULE_ID = "pf2e-shinobi";

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

describe("Milestone 3.5 spell variants & class wiring", () => {
  const classes = loadPackDocs("classes");
  const classFeatures = loadPackDocs("class-features");
  const spells = loadPackDocs("spells");

  test("ships 3 Charge Chakra variants at ranks 1, 2, and 3", () => {
    const variants = [
      { id: "SpllChargChakra0", rank: 1 },
      { id: "SpllChrgChak2nd0", rank: 2 },
      { id: "SpllChrgChak3rd0", rank: 3 },
    ];
    for (const variant of variants) {
      const spell = spells.get(variant.id);
      expect(spell).toBeDefined();
      const level = ((spell?.system ?? {}) as SpellSystem).level?.value;
      expect(level).toBe(variant.rank);
      const traditions = ((spell?.system ?? {}) as SpellSystem).traits?.traditions;
      expect(traditions).toEqual(["chakra"]);
    }
  });

  test("Expert/Master Chakra Caster class features grant the correct spell rank", () => {
    const expert = classFeatures.get("ClFtExprtChakra0");
    expect(expert).toBeDefined();
    expect(((expert?.system ?? {}) as FeatSystem).level?.value).toBe(7);
    const expertGrants = (((expert?.system ?? {}) as FeatSystem).rules ?? [])
      .filter((r) => r.key === "GrantItem")
      .map((r) => r.uuid);
    expect(expertGrants).toContain("Compendium.pf2e-shinobi.spells.Item.SpllChrgChak2nd0");

    const master = classFeatures.get("ClFtMastrChakra0");
    expect(master).toBeDefined();
    expect(((master?.system ?? {}) as FeatSystem).level?.value).toBe(15);
    const masterGrants = (((master?.system ?? {}) as FeatSystem).rules ?? [])
      .filter((r) => r.key === "GrantItem")
      .map((r) => r.uuid);
    expect(masterGrants).toContain("Compendium.pf2e-shinobi.spells.Item.SpllChrgChak3rd0");
  });

  test("every caster class has Expert and Master Chakra Caster in system.items at the right levels", () => {
    const casterIds = [
      "ClssNinjutsuSpc0",
      "ClssGenjutsuSpc0",
      "ClssMedicalNin00",
      "ClssSensorClass0",
      "ClssAnbuOprtve00",
      "ClssSummonerCl00",
    ];
    for (const classId of casterIds) {
      const doc = classes.get(classId);
      expect(doc).toBeDefined();
      const items = ((doc?.system ?? {}) as ClassSystem).items ?? {};
      const slots = Object.values(items);
      const expert = slots.find((s) => s.uuid?.endsWith("ClFtExprtChakra0"));
      const master = slots.find((s) => s.uuid?.endsWith("ClFtMastrChakra0"));
      expect(expert).toBeDefined();
      expect(expert?.level).toBe(7);
      expect(master).toBeDefined();
      expect(master?.level).toBe(15);
    }
  });

  test("martial classes (Taijutsu, Weapon Master) do NOT get Expert/Master Chakra Caster", () => {
    const martialIds = ["ClssTaijutsuSpc0", "ClssWeaponMastr0"];
    for (const classId of martialIds) {
      const doc = classes.get(classId);
      expect(doc).toBeDefined();
      const items = ((doc?.system ?? {}) as ClassSystem).items ?? {};
      const uuids = Object.values(items).map((s) => s.uuid ?? "");
      expect(uuids.some((u) => u.endsWith("ClFtExprtChakra0"))).toBe(false);
      expect(uuids.some((u) => u.endsWith("ClFtMastrChakra0"))).toBe(false);
    }
  });

  test("Anbu key ability is now [dex, cha] so PF2e prompts the choice", () => {
    const anbu = classes.get("ClssAnbuOprtve00");
    expect(anbu).toBeDefined();
    expect(((anbu?.system ?? {}) as ClassSystem).keyAbility?.value).toEqual(["dex", "cha"]);
  });

  test("every class declares the M3.5 spellcastingProgression + chakraKeyAbility flags", () => {
    const expectations: Record<string, { progression: string; ability: string }> = {
      ClssNinjutsuSpc0: { progression: "full", ability: "int" },
      ClssGenjutsuSpc0: { progression: "full", ability: "cha" },
      ClssTaijutsuSpc0: { progression: "none", ability: "str" },
      ClssMedicalNin00: { progression: "full", ability: "wis" },
      ClssSensorClass0: { progression: "half", ability: "wis" },
      ClssAnbuOprtve00: { progression: "half", ability: "dex" },
      ClssWeaponMastr0: { progression: "none", ability: "str" },
      ClssSummonerCl00: { progression: "full", ability: "cha" },
    };
    for (const [classId, expectation] of Object.entries(expectations)) {
      const doc = classes.get(classId);
      expect(doc).toBeDefined();
      const flags = readChakraFlags({
        flags: doc?.flags as Record<string, Record<string, unknown>>,
      });
      expect(flags).not.toBeNull();
      expect(flags?.spellcastingProgression).toBe(expectation.progression);
      expect(flags?.chakraKeyAbility).toBe(expectation.ability);
    }
  });
});

describe("buildChakraEntrySpec / plannedChakraEntries", () => {
  test("focus entry sets prepared='focus' and chakra tradition", () => {
    const spec = buildChakraEntrySpec("focus", "int", "ninjutsu-specialist");
    expect(spec).toMatchObject({
      type: "spellcastingEntry",
      system: {
        prepared: { value: "focus" },
        tradition: { value: "chakra" },
        ability: { value: "int" },
      },
    });
    const flags = (spec.flags as Record<string, Record<string, unknown>>)[MODULE_ID];
    expect(flags?.autoProvisioned).toBe(true);
    expect(flags?.kind).toBe("focus");
    expect(flags?.sourceClass).toBe("ninjutsu-specialist");
  });

  test("slot entry sets prepared='prepared' and empty 0..10 slot buckets", () => {
    const spec = buildChakraEntrySpec("slot", "wis", "medical-nin");
    expect(spec).toMatchObject({
      system: {
        prepared: { value: "prepared" },
        ability: { value: "wis" },
      },
    });
    const slots = (spec.system as Record<string, Record<string, { max: number }>>).slots ?? {};
    for (let r = 0; r <= 10; r += 1) {
      const bucket = slots[`slot${r}`];
      expect(bucket).toBeDefined();
      expect(bucket?.max).toBe(0);
    }
  });

  test("plannedChakraEntries produces 1 entry for none, 2 entries for full/half", () => {
    const none = plannedChakraEntries(
      { spellcastingProgression: "none", chakraKeyAbility: "str" },
      "taijutsu-specialist",
    );
    expect(none).toHaveLength(1);

    const full = plannedChakraEntries(
      { spellcastingProgression: "full", chakraKeyAbility: "int" },
      "ninjutsu-specialist",
    );
    expect(full).toHaveLength(2);

    const half = plannedChakraEntries(
      { spellcastingProgression: "half", chakraKeyAbility: "dex" },
      "anbu-operative",
    );
    expect(half).toHaveLength(2);
  });

  test("readChakraFlags rejects malformed input", () => {
    expect(readChakraFlags({})).toBeNull();
    expect(
      readChakraFlags({
        flags: {
          [MODULE_ID]: { spellcastingProgression: "weird", chakraKeyAbility: "int" },
        },
      }),
    ).toBeNull();
    expect(
      readChakraFlags({
        flags: {
          [MODULE_ID]: { spellcastingProgression: "full", chakraKeyAbility: "moon" },
        },
      }),
    ).toBeNull();
    expect(
      readChakraFlags({
        flags: {
          [MODULE_ID]: { spellcastingProgression: "full", chakraKeyAbility: "int" },
        },
      }),
    ).toEqual({ spellcastingProgression: "full", chakraKeyAbility: "int" });
  });
});
