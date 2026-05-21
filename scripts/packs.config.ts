/**
 * Canonical list of compendium packs shipped by the module.
 *
 * Both the build script (`scripts/build-packs.ts`) and the validation script
 * (`scripts/validate.ts`) consume this. Keep it in sync with `module.json`'s
 * `packs` array; a sanity check in `validate.ts` enforces parity.
 *
 * `documentTypes` is the union of PF2e Item `type` values legal for the pack.
 * Validation rejects entries whose `type` is not in this list.
 */
export interface PackConfig {
  /** Pack name as it appears in `module.json` (no module-id prefix). */
  name: string;
  /** Human-readable label, used for documentation only. */
  label: string;
  /** Foundry document type. All packs in this module are `Item` packs. */
  documentType: "Item" | "Actor" | "JournalEntry" | "RollTable" | "Macro";
  /** PF2e Item `system.type` values acceptable in this pack. */
  documentTypes: readonly string[];
  /** Source directory under `data/` (one JSON file per document). */
  sourceDir: string;
  /** Destination directory under `packs/` (LevelDB output). */
  outputDir: string;
}

export const PACKS: readonly PackConfig[] = [
  {
    name: "ancestries",
    label: "Shinobi Clans",
    documentType: "Item",
    documentTypes: ["ancestry"],
    sourceDir: "data/ancestries",
    outputDir: "packs/ancestries",
  },
  {
    name: "ancestry-features",
    label: "Shinobi Clan Features",
    documentType: "Item",
    documentTypes: ["feat"],
    sourceDir: "data/ancestry-features",
    outputDir: "packs/ancestry-features",
  },
  {
    name: "heritages",
    label: "Shinobi Bloodline Heritages",
    documentType: "Item",
    documentTypes: ["heritage"],
    sourceDir: "data/heritages",
    outputDir: "packs/heritages",
  },
  {
    name: "heritage-actions",
    label: "Shinobi Heritage Actions",
    documentType: "Item",
    documentTypes: ["action"],
    sourceDir: "data/heritage-actions",
    outputDir: "packs/heritage-actions",
  },
  {
    name: "backgrounds",
    label: "Shinobi Backgrounds",
    documentType: "Item",
    documentTypes: ["background"],
    sourceDir: "data/backgrounds",
    outputDir: "packs/backgrounds",
  },
  {
    name: "background-actions",
    label: "Shinobi Background Actions",
    documentType: "Item",
    documentTypes: ["action"],
    sourceDir: "data/background-actions",
    outputDir: "packs/background-actions",
  },
  {
    name: "classes",
    label: "Shinobi Specializations",
    documentType: "Item",
    documentTypes: ["class"],
    sourceDir: "data/classes",
    outputDir: "packs/classes",
  },
  {
    name: "class-features",
    label: "Shinobi Class Features",
    documentType: "Item",
    documentTypes: ["feat"],
    sourceDir: "data/class-features",
    outputDir: "packs/class-features",
  },
  {
    name: "class-actions",
    label: "Shinobi Class Actions",
    documentType: "Item",
    documentTypes: ["action"],
    sourceDir: "data/class-actions",
    outputDir: "packs/class-actions",
  },
  {
    name: "feats",
    label: "Shinobi Feats",
    documentType: "Item",
    documentTypes: ["feat"],
    sourceDir: "data/feats",
    outputDir: "packs/feats",
  },
  {
    name: "spells",
    label: "Jutsu",
    documentType: "Item",
    documentTypes: ["spell"],
    sourceDir: "data/spells",
    outputDir: "packs/spells",
  },
  {
    name: "spell-actions",
    label: "Jutsu Actions",
    documentType: "Item",
    documentTypes: ["action"],
    sourceDir: "data/spell-actions",
    outputDir: "packs/spell-actions",
  },
  {
    name: "spell-effects",
    label: "Jutsu Effects",
    documentType: "Item",
    documentTypes: ["effect"],
    sourceDir: "data/spell-effects",
    outputDir: "packs/spell-effects",
  },
  {
    name: "equipment",
    label: "Shinobi Equipment",
    documentType: "Item",
    documentTypes: ["equipment", "weapon", "armor", "consumable", "treasure", "backpack"],
    sourceDir: "data/equipment",
    outputDir: "packs/equipment",
  },
  {
    name: "equipment-actions",
    label: "Shinobi Equipment Actions",
    documentType: "Item",
    documentTypes: ["action"],
    sourceDir: "data/equipment-actions",
    outputDir: "packs/equipment-actions",
  },
  {
    name: "equipment-effects",
    label: "Shinobi Equipment Effects",
    documentType: "Item",
    documentTypes: ["effect"],
    sourceDir: "data/equipment-effects",
    outputDir: "packs/equipment-effects",
  },
  {
    name: "deities",
    label: "Shinobi Paths & Legends",
    documentType: "Item",
    documentTypes: ["deity"],
    sourceDir: "data/deities",
    outputDir: "packs/deities",
  },
  {
    name: "familiar-abilities",
    label: "Shinobi Familiar Abilities",
    documentType: "Item",
    documentTypes: ["action", "feat"],
    sourceDir: "data/familiar-abilities",
    outputDir: "packs/familiar-abilities",
  },
  {
    name: "ac-ancestries",
    label: "Shinobi Companion Ancestries",
    documentType: "Item",
    documentTypes: ["ancestry", "feat"],
    sourceDir: "data/ac-ancestries",
    outputDir: "packs/ac-ancestries",
  },
  {
    name: "ac-feats",
    label: "Shinobi Companion Feats",
    documentType: "Item",
    documentTypes: ["feat"],
    sourceDir: "data/ac-feats",
    outputDir: "packs/ac-feats",
  },
  {
    name: "ac-adv-maneuvers",
    label: "Shinobi Companion Maneuvers",
    documentType: "Item",
    documentTypes: ["action"],
    sourceDir: "data/ac-adv-maneuvers",
    outputDir: "packs/ac-adv-maneuvers",
  },
  {
    name: "ac-support",
    label: "Shinobi Companion Support",
    documentType: "Item",
    documentTypes: ["feat"],
    sourceDir: "data/ac-support",
    outputDir: "packs/ac-support",
  },
  {
    name: "effects",
    label: "Shinobi Misc Effects",
    documentType: "Item",
    documentTypes: ["effect"],
    sourceDir: "data/effects",
    outputDir: "packs/effects",
  },
] as const;
