import { readFile, stat } from "node:fs/promises";
import { relative } from "node:path";
import fg from "fast-glob";
import Ajv, { type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

import { PACKS, type PackConfig } from "./packs.config.ts";
import { documentSchema, type CompendiumDocument } from "./schemas/document.ts";
import { ROOT, color, fromRoot, log, logError, logWarn } from "./utils.ts";

interface ValidationIssue {
  file: string;
  message: string;
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

function makeValidator(): ValidateFunction<CompendiumDocument> {
  const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, strict: false });
  addFormats(ajv);
  return ajv.compile(documentSchema);
}

async function readModuleJson(): Promise<ModuleJson> {
  const raw = await readFile(fromRoot("module.json"), "utf8");
  return JSON.parse(raw) as ModuleJson;
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

async function validatePack(
  pack: PackConfig,
  validate: ValidateFunction<CompendiumDocument>,
): Promise<{ issues: ValidationIssue[]; count: number }> {
  const issues: ValidationIssue[] = [];
  const sourceAbs = fromRoot(pack.sourceDir);

  try {
    const st = await stat(sourceAbs);
    if (!st.isDirectory()) {
      issues.push({ file: pack.sourceDir, message: "Source path is not a directory." });
      return { issues, count: 0 };
    }
  } catch {
    issues.push({ file: pack.sourceDir, message: "Source directory does not exist." });
    return { issues, count: 0 };
  }

  const files = await fg("**/*.json", { cwd: sourceAbs, absolute: true });
  const seenIds = new Map<string, string>();
  const seenSlugs = new Map<string, string>();

  for (const file of files) {
    const rel = relative(ROOT, file).replace(/\\/g, "/");
    let parsed: unknown;
    try {
      parsed = JSON.parse(await readFile(file, "utf8"));
    } catch (err) {
      issues.push({ file: rel, message: `Invalid JSON: ${(err as Error).message}` });
      continue;
    }

    if (!validate(parsed)) {
      for (const err of validate.errors ?? []) {
        issues.push({
          file: rel,
          message: `${err.instancePath || "(root)"} ${err.message ?? "failed validation"}`,
        });
      }
      continue;
    }

    const doc = parsed as CompendiumDocument;
    if (!pack.documentTypes.includes(doc.type)) {
      issues.push({
        file: rel,
        message: `type "${doc.type}" is not allowed in pack "${pack.name}" (expected one of: ${pack.documentTypes.join(", ")}).`,
      });
    }

    if (doc._id) {
      const prev = seenIds.get(doc._id);
      if (prev) {
        issues.push({
          file: rel,
          message: `Duplicate _id "${doc._id}" (also used by ${prev}).`,
        });
      } else {
        seenIds.set(doc._id, rel);
      }
    }

    const slug = doc.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const prevSlug = seenSlugs.get(slug);
    if (prevSlug) {
      issues.push({
        file: rel,
        message: `Duplicate name slug "${slug}" (also used by ${prevSlug}).`,
      });
    } else {
      seenSlugs.set(slug, rel);
    }
  }

  return { issues, count: files.length };
}

async function main(): Promise<void> {
  const validate = makeValidator();
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

  for (const pack of PACKS) {
    const { issues, count } = await validatePack(pack, validate);
    totalDocs += count;
    if (issues.length > 0) {
      totalIssues += issues.length;
      for (const issue of issues) {
        logError("validate", `${issue.file}: ${issue.message}`);
      }
    } else {
      log(
        "validate",
        `${color.bold(pack.name.padEnd(22))} ${color.gray(`${count} document${count === 1 ? "" : "s"}`)}`,
      );
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
