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

interface ClassItemSlot {
  uuid?: string;
  name?: string;
  level?: number;
}

interface ClassSystem {
  items?: Record<string, ClassItemSlot>;
  spellcasting?: number;
  keyAbility?: { value: string[] };
  hp?: number;
}

interface FeatSystem {
  category?: string;
  rules?: Array<{ key: string; uuid?: string; choices?: unknown }>;
}

interface SpellSystem {
  traits?: { traditions?: string[]; value?: string[] };
}

const REPO_ROOT = resolve(__dirname, "..");
const MODULE_ID = "pf2e-shinobi";
const UUID_PATTERN = /^Compendium\.([^.]+)\.([^.]+)\.Item\.([A-Za-z0-9]{16})$/;

const CHARGE_CHAKRA_UUID = "Compendium.pf2e-shinobi.spells.Item.SpllChargChakra0";
const CHAKRA_RESERVES_UUID = "Compendium.pf2e-shinobi.class-features.Item.ClFtChakraReser0";
const CHARGE_CHAKRA_FEATURE_UUID = "Compendium.pf2e-shinobi.class-features.Item.ClFtChargeChakr0";

function loadPackDocs(packName: string): Map<string, CompendiumDoc> {
  const pack = PACKS.find((p) => p.name === packName);
  if (!pack) throw new Error(`Unknown pack ${packName}`);
  const dir = join(REPO_ROOT, pack.sourceDir);
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return new Map();
  }
  const docs = new Map<string, CompendiumDoc>();
  for (const name of names) {
    if (!name.endsWith(".json") || name === "_folders.json") continue;
    const full = join(dir, name);
    if (!statSync(full).isFile()) continue;
    const parsed = JSON.parse(readFileSync(full, "utf8")) as CompendiumDoc;
    if (parsed._id) docs.set(parsed._id, parsed);
  }
  return docs;
}

describe("Milestone 3 classes & chakra core", () => {
  const classes = loadPackDocs("classes");
  const classFeatures = loadPackDocs("class-features");
  const classActions = loadPackDocs("class-actions");
  const spells = loadPackDocs("spells");

  const idsByPack = new Map<string, Set<string>>([
    ["class-features", new Set(classFeatures.keys())],
    ["class-actions", new Set(classActions.keys())],
    ["spells", new Set(spells.keys())],
  ]);

  test("ships 8 specializations, 45 class features, 10 class actions, and 3 Charge Chakra ranks", () => {
    expect(classes.size).toBe(8);
    expect(classFeatures.size).toBe(45);
    expect(classActions.size).toBe(10);
    expect(spells.has("SpllChargChakra0")).toBe(true);
    expect(spells.has("SpllChrgChak2nd0")).toBe(true);
    expect(spells.has("SpllChrgChak3rd0")).toBe(true);
  });

  test("every class has Charge Chakra in its starting items (either directly or via Chakra Casting)", () => {
    for (const [classId, doc] of classes) {
      const items = ((doc.system ?? {}) as ClassSystem).items ?? {};
      const uuids = new Set(
        Object.values(items)
          .map((slot) => slot.uuid)
          .filter(Boolean) as string[],
      );
      const hasCharge = uuids.has(CHARGE_CHAKRA_FEATURE_UUID);
      const hasReserves = uuids.has(CHAKRA_RESERVES_UUID);
      if (!hasCharge || !hasReserves) {
        throw new Error(
          `Class ${classId} is missing Charge Chakra (${hasCharge}) or Chakra Reserves (${hasReserves}) in system.items`,
        );
      }
    }
  });

  test("the Charge Chakra class feature actually grants the Charge Chakra spell", () => {
    const feat = classFeatures.get("ClFtChargeChakr0");
    expect(feat).toBeDefined();
    const rules = ((feat?.system ?? {}) as FeatSystem).rules ?? [];
    const grants = rules.filter((r) => r.key === "GrantItem").map((r) => r.uuid);
    expect(grants).toContain(CHARGE_CHAKRA_UUID);
  });

  test("Charge Chakra carries the chakra tradition and focus trait", () => {
    const spell = spells.get("SpllChargChakra0");
    expect(spell).toBeDefined();
    const traits = ((spell?.system ?? {}) as SpellSystem).traits ?? {};
    expect(traits.traditions).toEqual(["chakra"]);
    expect(traits.value).toEqual(expect.arrayContaining(["chakra", "focus"]));
  });

  test("every class-feature in class-features pack has category 'classfeature'", () => {
    for (const [id, doc] of classFeatures) {
      const sys = (doc.system ?? {}) as FeatSystem;
      expect(sys.category).toBe("classfeature");
      expect(id).toMatch(/^ClFt[A-Za-z0-9]{12}$/);
    }
  });

  test("every class-action in class-actions pack has category 'class'", () => {
    for (const [id, doc] of classActions) {
      const sys = (doc.system ?? {}) as { category?: string };
      expect(sys.category).toBe("class");
      expect(id).toMatch(/^ClAc[A-Za-z0-9]{12}$/);
    }
  });

  test("each subclass picker actually targets existing class-features", () => {
    const pickerIds = [
      "ClFtNinjutsuPth0",
      "ClFtGenjutsuPth0",
      "ClFtTaijutsuPth0",
      "ClFtMedicalPth00",
      "ClFtSensorPth000",
      "ClFtAnbuPth00000",
      "ClFtWeaponMPth00",
      "ClFtSummonerPth0",
    ];
    for (const id of pickerIds) {
      const feat = classFeatures.get(id);
      expect(feat).toBeDefined();
      const rules = ((feat?.system ?? {}) as FeatSystem).rules ?? [];
      const choiceSet = rules.find((r) => r.key === "ChoiceSet") as
        | { choices?: Array<{ value: string }> }
        | undefined;
      expect(choiceSet).toBeDefined();
      const choices = choiceSet?.choices ?? [];
      expect(choices.length).toBeGreaterThanOrEqual(2);
      for (const choice of choices) {
        const match = UUID_PATTERN.exec(choice.value);
        expect(match).not.toBeNull();
        if (!match) continue;
        const [, refModule, refPack, refId] = match;
        expect(refModule).toBe(MODULE_ID);
        expect(refPack).toBe("class-features");
        const ids = idsByPack.get("class-features");
        expect(ids?.has(refId ?? "")).toBe(true);
      }
    }
  });

  test("each Specialization class feature grants a corresponding class action", () => {
    const expectedGrants: Record<string, string> = {
      ClFtNinjutsuSpc0: "ClAcFiveElement0",
      ClFtGenjutsuSpc0: "ClAcGenjutsuRels",
      ClFtTaijutsuSpc0: "ClAcGentleStrk00",
      ClFtMedicalSpc00: "ClAcHealingPalm0",
      ClFtSensorSpc000: "ClAcSenseChakra0",
      ClFtAnbuSpc00000: "ClAcSilntStrike0",
      ClFtWeaponMSpc00: "ClAcWpnDraw00000",
      ClFtSummonerSpc0: "ClAcSummonAlly00",
    };
    for (const [featureId, actionId] of Object.entries(expectedGrants)) {
      const feat = classFeatures.get(featureId);
      expect(feat).toBeDefined();
      const rules = ((feat?.system ?? {}) as FeatSystem).rules ?? [];
      const granted = rules
        .filter((r) => r.key === "GrantItem")
        .map((r) => r.uuid)
        .filter(Boolean) as string[];
      const expectedUuid = `Compendium.pf2e-shinobi.class-actions.Item.${actionId}`;
      expect(granted).toContain(expectedUuid);
    }
  });
});
