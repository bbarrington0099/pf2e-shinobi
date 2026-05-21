import { readFile, stat } from "node:fs/promises";
import { relative } from "node:path";
import fg from "fast-glob";
import Ajv, { type Schema, type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

import { PACKS, type PackConfig } from "./packs.config.ts";
import { documentSchema, folderSchema, schemasByType } from "./schemas/index.ts";
import { ROOT, color, fromRoot, log, logError, logWarn } from "./utils.ts";

interface ValidationIssue {
  file: string;
  message: string;
}

interface CompendiumDoc {
  _id?: string;
  name: string;
  type: string;
  folder?: string | null;
  system?: Record<string, unknown>;
}

interface FolderDoc {
  _id: string;
  name: string;
  type: string;
  folder?: string | null;
}

interface ModuleJsonPack {
  name: string;
  path: string;
  type: string;
}

interface ModuleJson {
  id: string;
  packs: ModuleJsonPack[];
}

interface PackContents {
  documents: { file: string; doc: CompendiumDoc }[];
  folders: { file: string; folder: FolderDoc }[];
}

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, strict: false });
addFormats(ajv);

const baseValidator = ajv.compile(documentSchema);
const folderValidator = ajv.compile(folderSchema);
const typeValidators: Record<string, ValidateFunction> = {};
for (const [type, schema] of Object.entries(schemasByType)) {
  typeValidators[type] = ajv.compile(schema as Schema);
}

async function readModuleJson(): Promise<ModuleJson> {
  return JSON.parse(await readFile(fromRoot("module.json"), "utf8")) as ModuleJson;
}

function checkPacksParity(moduleJson: ModuleJson): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fromModule = new Map(moduleJson.packs.map((p) => [p.name, p]));
  const fromConfig = new Map(PACKS.map((p) => [p.name, p]));

  for (const cfg of PACKS) {
    const mod = fromModule.get(cfg.name);
    if (!mod) {
      issues.push({
        file: "module.json",
        message: `Pack "${cfg.name}" is listed in scripts/packs.config.ts but missing from module.json.`,
      });
      continue;
    }
    if (mod.type !== cfg.documentType) {
      issues.push({
        file: "module.json",
        message: `Pack "${cfg.name}" type mismatch: module.json="${mod.type}", config="${cfg.documentType}".`,
      });
    }
    if (mod.path !== cfg.outputDir) {
      issues.push({
        file: "module.json",
        message: `Pack "${cfg.name}" path mismatch: module.json="${mod.path}", config="${cfg.outputDir}".`,
      });
    }
  }

  for (const mod of moduleJson.packs) {
    if (!fromConfig.has(mod.name)) {
      issues.push({
        file: "module.json",
        message: `Pack "${mod.name}" is declared in module.json but missing from scripts/packs.config.ts.`,
      });
    }
  }
  return issues;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function loadPack(
  pack: PackConfig,
): Promise<{ issues: ValidationIssue[]; contents: PackContents }> {
  const issues: ValidationIssue[] = [];
  const contents: PackContents = { documents: [], folders: [] };
  const sourceAbs = fromRoot(pack.sourceDir);

  try {
    const st = await stat(sourceAbs);
    if (!st.isDirectory()) {
      issues.push({ file: pack.sourceDir, message: "Source path is not a directory." });
      return { issues, contents };
    }
  } catch {
    issues.push({ file: pack.sourceDir, message: "Source directory does not exist." });
    return { issues, contents };
  }

  const files = await fg("**/*.json", { cwd: sourceAbs, absolute: true });
  for (const file of files) {
    const rel = relative(ROOT, file).replace(/\\/g, "/");
    let parsed: unknown;
    try {
      parsed = JSON.parse(await readFile(file, "utf8"));
    } catch (err) {
      issues.push({ file: rel, message: `Invalid JSON: ${(err as Error).message}` });
      continue;
    }

    if (file.endsWith("_folders.json")) {
      if (!Array.isArray(parsed)) {
        issues.push({ file: rel, message: "_folders.json must be a top-level array." });
        continue;
      }
      for (let i = 0; i < parsed.length; i += 1) {
        const entry = parsed[i] as FolderDoc;
        if (!folderValidator(entry)) {
          for (const err of folderValidator.errors ?? []) {
            issues.push({
              file: rel,
              message: `[${i}]${err.instancePath || ""} ${err.message ?? "failed folder schema"}`,
            });
          }
          continue;
        }
        contents.folders.push({ file: rel, folder: entry });
      }
      continue;
    }

    if (!baseValidator(parsed)) {
      for (const err of baseValidator.errors ?? []) {
        issues.push({
          file: rel,
          message: `${err.instancePath || "(root)"} ${err.message ?? "failed base validation"}`,
        });
      }
      continue;
    }

    const doc = parsed as CompendiumDoc;

    if (!pack.documentTypes.includes(doc.type)) {
      issues.push({
        file: rel,
        message: `type "${doc.type}" is not allowed in pack "${pack.name}" (expected one of: ${pack.documentTypes.join(", ")}).`,
      });
      continue;
    }

    const typeValidator = typeValidators[doc.type];
    if (typeValidator && !typeValidator(parsed)) {
      for (const err of typeValidator.errors ?? []) {
        issues.push({
          file: rel,
          message: `${err.instancePath || "(root)"} ${err.message ?? "failed type-specific validation"}`,
        });
      }
      continue;
    }

    contents.documents.push({ file: rel, doc });
  }

  return { issues, contents };
}

function checkIntraPack(
  pack: PackConfig,
  contents: PackContents,
  moduleId: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Map<string, string>();
  const seenSlugs = new Map<string, string>();
  const folderIds = new Set(contents.folders.map((f) => f.folder._id));

  for (const folder of contents.folders) {
    if (seenIds.has(folder.folder._id)) {
      issues.push({
        file: folder.file,
        message: `Duplicate _id "${folder.folder._id}" in folders (also used by ${seenIds.get(folder.folder._id)}).`,
      });
    } else {
      seenIds.set(folder.folder._id, folder.file);
    }
  }

  for (const { file, doc } of contents.documents) {
    if (doc._id) {
      const prev = seenIds.get(doc._id);
      if (prev) {
        issues.push({ file, message: `Duplicate _id "${doc._id}" (also used by ${prev}).` });
      } else {
        seenIds.set(doc._id, file);
      }
    }

    const slug = slugify(doc.name);
    const prevSlug = seenSlugs.get(slug);
    if (prevSlug) {
      issues.push({ file, message: `Duplicate name slug "${slug}" (also used by ${prevSlug}).` });
    } else {
      seenSlugs.set(slug, file);
    }

    if (doc.folder && doc.folder !== null && !folderIds.has(doc.folder)) {
      issues.push({
        file,
        message: `Document references folder "${doc.folder}" but it is not declared in this pack's _folders.json.`,
      });
    }
  }

  // Loose sanity: cross-pack UUID references to *this* pack should resolve.
  void pack;
  void moduleId;
  return issues;
}

interface RuleElement {
  key: string;
  uuid?: string;
}

interface AncestryItemEntry {
  uuid?: string;
}

const UUID_PATTERN = /^Compendium\.([^.]+)\.([^.]+)\.Item\.([A-Za-z0-9]{16})$/;

function collectIdsByPack(allContents: Map<string, PackContents>): Map<string, Set<string>> {
  const idsByPack = new Map<string, Set<string>>();
  for (const [packName, contents] of allContents) {
    const ids = new Set<string>();
    for (const { doc } of contents.documents) {
      if (doc._id) ids.add(doc._id);
    }
    idsByPack.set(packName, ids);
  }
  return idsByPack;
}

function checkInternalUuid(
  uuid: string,
  moduleId: string,
  idsByPack: Map<string, Set<string>>,
): string | null {
  const match = UUID_PATTERN.exec(uuid);
  if (!match) return null;
  const [, refModule, refPack, refId] = match;
  if (refModule !== moduleId) return null;
  const ids = idsByPack.get(refPack ?? "");
  if (!ids) return `references unknown pack "${refPack}"`;
  if (!refId || !ids.has(refId)) return `references unknown _id "${refId}" in pack "${refPack}"`;
  return null;
}

function checkCrossPack(
  moduleId: string,
  allContents: Map<string, PackContents>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const idsByPack = collectIdsByPack(allContents);

  // Heritages -> ancestries (system.ancestry.uuid).
  const heritages = allContents.get("heritages")?.documents ?? [];
  for (const { file, doc } of heritages) {
    const sys = (doc.system ?? {}) as { ancestry?: { uuid?: string } };
    const uuid = sys.ancestry?.uuid;
    if (!uuid) continue;
    const err = checkInternalUuid(uuid, moduleId, idsByPack);
    if (err) {
      issues.push({ file, message: `system.ancestry.uuid ${err}.` });
    } else {
      // Pack-specific tightening: the parent must actually live in ancestries.
      const match = UUID_PATTERN.exec(uuid);
      if (match && match[1] === moduleId && match[2] !== "ancestries") {
        issues.push({
          file,
          message: `system.ancestry.uuid points at pack "${match[2]}"; expected "ancestries".`,
        });
      }
    }
  }

  // Ancestries -> ancestry-features via system.items map.
  const ancestries = allContents.get("ancestries")?.documents ?? [];
  for (const { file, doc } of ancestries) {
    const sys = (doc.system ?? {}) as { items?: Record<string, AncestryItemEntry> };
    const items = sys.items ?? {};
    for (const [slot, entry] of Object.entries(items)) {
      const uuid = entry?.uuid;
      if (!uuid) continue;
      const err = checkInternalUuid(uuid, moduleId, idsByPack);
      if (err) {
        issues.push({ file, message: `system.items["${slot}"].uuid ${err}.` });
      }
    }
  }

  // Heritages and ancestry-features -> GrantItem rule UUIDs.
  for (const packName of ["heritages", "ancestry-features"]) {
    const docs = allContents.get(packName)?.documents ?? [];
    for (const { file, doc } of docs) {
      const sys = (doc.system ?? {}) as { rules?: RuleElement[] };
      const rules = Array.isArray(sys.rules) ? sys.rules : [];
      for (let i = 0; i < rules.length; i += 1) {
        const rule = rules[i];
        if (!rule || rule.key !== "GrantItem" || !rule.uuid) continue;
        if (rule.uuid.startsWith("{")) continue;
        const err = checkInternalUuid(rule.uuid, moduleId, idsByPack);
        if (err) {
          issues.push({ file, message: `rules[${i}].uuid (GrantItem) ${err}.` });
        }
      }
    }
  }

  return issues;
}

async function main(): Promise<void> {
  const moduleJson = await readModuleJson();
  if (moduleJson.id !== "pf2e-shinobi") {
    logWarn("validate", `module.json id is "${moduleJson.id}", expected "pf2e-shinobi".`);
  }

  let totalDocs = 0;
  let totalIssues = 0;

  const parityIssues = checkPacksParity(moduleJson);
  if (parityIssues.length > 0) {
    totalIssues += parityIssues.length;
    for (const issue of parityIssues) {
      logError("validate", `${issue.file}: ${issue.message}`);
    }
  }

  const allContents = new Map<string, PackContents>();

  for (const pack of PACKS) {
    const { issues, contents } = await loadPack(pack);
    const intraIssues = checkIntraPack(pack, contents, moduleJson.id);
    const packIssues = [...issues, ...intraIssues];

    totalDocs += contents.documents.length;
    allContents.set(pack.name, contents);

    if (packIssues.length > 0) {
      totalIssues += packIssues.length;
      for (const issue of packIssues) {
        logError("validate", `${issue.file}: ${issue.message}`);
      }
    } else {
      const folderNote =
        contents.folders.length > 0 ? color.gray(`, ${contents.folders.length} folder(s)`) : "";
      log(
        "validate",
        `${color.bold(pack.name.padEnd(22))} ${color.gray(`${contents.documents.length} document${contents.documents.length === 1 ? "" : "s"}${folderNote}`)}`,
      );
    }
  }

  const crossIssues = checkCrossPack(moduleJson.id, allContents);
  if (crossIssues.length > 0) {
    totalIssues += crossIssues.length;
    for (const issue of crossIssues) {
      logError("validate", `${issue.file}: ${issue.message}`);
    }
  }

  log(
    "validate",
    `${color.bold("Done.")} ${totalDocs} document(s), ${totalIssues === 0 ? color.green("0 issues") : color.red(`${totalIssues} issue(s)`)}.`,
  );

  if (totalIssues > 0) process.exit(1);
}

void main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
