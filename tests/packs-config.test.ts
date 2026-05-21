import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PACKS } from "../scripts/packs.config";

interface ModuleJsonPack {
  name: string;
  path: string;
  type: string;
}

interface ModuleJson {
  id: string;
  packs: ModuleJsonPack[];
}

const moduleJson = JSON.parse(
  readFileSync(resolve(__dirname, "..", "module.json"), "utf8"),
) as ModuleJson;

describe("module.json <-> packs.config.ts parity", () => {
  test("module.json id matches expectations", () => {
    expect(moduleJson.id).toBe("pf2e-shinobi");
  });

  test("every pack in packs.config.ts is declared in module.json", () => {
    const fromModule = new Map(moduleJson.packs.map((p) => [p.name, p]));
    for (const pack of PACKS) {
      const entry = fromModule.get(pack.name);
      expect(entry).toBeDefined();
      expect(entry?.type).toBe(pack.documentType);
      expect(entry?.path).toBe(pack.outputDir);
    }
  });

  test("every pack in module.json is declared in packs.config.ts", () => {
    const fromConfig = new Set(PACKS.map((p) => p.name));
    for (const pack of moduleJson.packs) {
      expect(fromConfig.has(pack.name)).toBe(true);
    }
  });

  test("pack source/output directories are unique", () => {
    const sources = new Set<string>();
    const outputs = new Set<string>();
    for (const pack of PACKS) {
      expect(sources.has(pack.sourceDir)).toBe(false);
      expect(outputs.has(pack.outputDir)).toBe(false);
      sources.add(pack.sourceDir);
      outputs.add(pack.outputDir);
    }
  });
});
