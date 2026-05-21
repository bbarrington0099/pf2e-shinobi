import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { PACKS } from "../scripts/packs.config";

interface CompendiumDoc {
  _id?: string;
  name: string;
  type: string;
  system?: Record<string, unknown>;
}

interface AncestrySystem {
  items?: Record<string, { uuid?: string }>;
}

interface HeritageSystem {
  ancestry?: { uuid?: string };
  rules?: Array<{ key: string; uuid?: string }>;
}

const REPO_ROOT = resolve(__dirname, "..");
const MODULE_ID = "pf2e-shinobi";
const UUID_PATTERN = /^Compendium\.([^.]+)\.([^.]+)\.Item\.([A-Za-z0-9]{16})$/;

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

function assertUuidResolves(
  uuid: string,
  expectedPack: string,
  knownIdsByPack: Map<string, Set<string>>,
): void {
  const match = UUID_PATTERN.exec(uuid);
  expect(match).not.toBeNull();
  if (!match) return;
  const [, refModule, refPack, refId] = match;
  expect(refModule).toBe(MODULE_ID);
  expect(refPack).toBe(expectedPack);
  const ids = knownIdsByPack.get(expectedPack);
  expect(ids).toBeDefined();
  expect(ids?.has(refId ?? "")).toBe(true);
}

describe("Milestone 2 cross-pack references", () => {
  const ancestries = loadPackDocs("ancestries");
  const heritages = loadPackDocs("heritages");
  const features = loadPackDocs("ancestry-features");

  const idsByPack = new Map<string, Set<string>>([
    ["ancestries", new Set(ancestries.keys())],
    ["heritages", new Set(heritages.keys())],
    ["ancestry-features", new Set(features.keys())],
  ]);

  test("Milestone 2 produces exactly 11 ancestries, 22 heritages, 21 ancestry features", () => {
    expect(ancestries.size).toBe(11);
    expect(heritages.size).toBe(22);
    expect(features.size).toBe(21);
  });

  test("each ancestry's system.items.*.uuid resolves to an ancestry-features document", () => {
    for (const [id, doc] of ancestries) {
      const items = ((doc.system ?? {}) as AncestrySystem).items ?? {};
      const entries = Object.values(items);
      expect(entries.length).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(entry.uuid).toBeDefined();
        assertUuidResolves(entry.uuid ?? "", "ancestry-features", idsByPack);
      }
      expect(id).toMatch(/^Ance[A-Za-z0-9]{12}$/);
    }
  });

  test("each heritage's system.ancestry.uuid resolves to an ancestry", () => {
    for (const [, doc] of heritages) {
      const sys = (doc.system ?? {}) as HeritageSystem;
      const uuid = sys.ancestry?.uuid;
      expect(uuid).toBeDefined();
      assertUuidResolves(uuid ?? "", "ancestries", idsByPack);
    }
  });

  test("every heritage GrantItem rule resolves inside the module", () => {
    for (const [, doc] of heritages) {
      const sys = (doc.system ?? {}) as HeritageSystem;
      const rules = sys.rules ?? [];
      for (const rule of rules) {
        if (rule.key !== "GrantItem") continue;
        if (!rule.uuid || rule.uuid.startsWith("{")) continue;
        assertUuidResolves(rule.uuid, "ancestry-features", idsByPack);
      }
    }
  });

  test("every ancestry feature has its parent clan folder set", () => {
    const knownFolderPrefix = "FldA";
    for (const [, doc] of features) {
      const folder = (doc as { folder?: string | null }).folder;
      expect(typeof folder).toBe("string");
      expect(folder?.startsWith(knownFolderPrefix)).toBe(true);
    }
  });

  test("every heritage has its parent clan folder set", () => {
    for (const [, doc] of heritages) {
      const folder = (doc as { folder?: string | null }).folder;
      expect(typeof folder).toBe("string");
      expect(folder?.startsWith("Fldr")).toBe(true);
    }
  });
});
