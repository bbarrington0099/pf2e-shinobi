import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { compilePack } from "@foundryvtt/foundryvtt-cli";

import { PACKS, type PackConfig } from "./packs.config.ts";
import { color, fromRoot, log, logError, logWarn } from "./utils.ts";

/**
 * Build every compendium pack declared in `packs.config.ts`.
 *
 * Why this is more involved than a single `compilePack` call:
 *
 * The Foundry CLI's `compilePack` reads JSON source files and writes them into
 * a LevelDB compendium, but it silently skips any document that does not have
 * an internal `_key` field. The `_key` is the LevelDB key the document will
 * live under (e.g. `!items!AnceUchihaClan00`). `extractPack` removes that key
 * when dumping back to JSON, which is why upstream PF2e source files do not
 * include it &mdash; they use a bespoke builder that re-derives `_key` from
 * the file location at pack time.
 *
 * Mirroring that, the steps below are:
 *   1. Read every JSON in the pack's `data/` directory.
 *   2. Special-case `_folders.json` (an array of folder records).
 *   3. Inject the right `_key` per document based on the pack's
 *      `documentType` (Item, Actor, etc.) and write each entry to a temp
 *      staging directory.
 *   4. Hand the staging directory to `compilePack`.
 *   5. Remove the staging directory after the LevelDB pack is built.
 */

const DOCUMENT_COLLECTIONS: Record<PackConfig["documentType"], string> = {
  Item: "items",
  Actor: "actors",
  JournalEntry: "journal",
  RollTable: "tables",
  Macro: "macros",
};

interface FolderRecord {
  _id: string;
  name: string;
  [key: string]: unknown;
}

interface DocumentRecord {
  _id: string;
  name: string;
  [key: string]: unknown;
}

async function isEmptyDir(path: string): Promise<boolean> {
  try {
    const entries = await readdir(path);
    return entries.every((e) => e.startsWith("."));
  } catch {
    return true;
  }
}

async function stagePack(
  srcAbs: string,
  stageAbs: string,
  documentCollection: string,
): Promise<{ docs: number; folders: number }> {
  await rm(stageAbs, { recursive: true, force: true });
  await mkdir(stageAbs, { recursive: true });

  let docs = 0;
  let folders = 0;
  const entries = await readdir(srcAbs);

  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue;
    const src = join(srcAbs, entry);
    const raw = await readFile(src, "utf8");

    if (entry === "_folders.json") {
      const folderList = JSON.parse(raw) as FolderRecord[];
      if (!Array.isArray(folderList)) {
        throw new Error(`_folders.json in ${srcAbs} must be a top-level array.`);
      }
      for (const folder of folderList) {
        if (!folder._id) {
          throw new Error(`Folder in ${srcAbs}/_folders.json is missing _id.`);
        }
        const keyed = { ...folder, _key: `!folders!${folder._id}` };
        await writeFile(
          join(stageAbs, `_folder_${folder._id}.json`),
          JSON.stringify(keyed, null, 2),
          "utf8",
        );
        folders += 1;
      }
      continue;
    }

    const doc = JSON.parse(raw) as DocumentRecord;
    if (!doc._id) {
      throw new Error(`Document ${src} is missing _id (required for compilation).`);
    }
    const keyed = { ...doc, _key: `!${documentCollection}!${doc._id}` };
    await writeFile(join(stageAbs, basename(entry)), JSON.stringify(keyed, null, 2), "utf8");
    docs += 1;
  }

  return { docs, folders };
}

async function buildOne(pack: PackConfig, srcAbs: string, dstAbs: string): Promise<void> {
  const collection = DOCUMENT_COLLECTIONS[pack.documentType];
  if (!collection) {
    throw new Error(`Unsupported documentType "${pack.documentType}" for pack "${pack.name}".`);
  }
  const stageAbs = `${dstAbs}.staging`;
  try {
    await stagePack(srcAbs, stageAbs, collection);
    await rm(dstAbs, { recursive: true, force: true });
    await mkdir(dstAbs, { recursive: true });
    await compilePack(stageAbs, dstAbs, { recursive: false, log: false });
  } finally {
    await rm(stageAbs, { recursive: true, force: true });
  }
}

async function main(): Promise<void> {
  let built = 0;
  let skipped = 0;
  let failed = 0;

  for (const pack of PACKS) {
    const srcAbs = fromRoot(pack.sourceDir);
    const dstAbs = fromRoot(pack.outputDir);

    try {
      const st = await stat(srcAbs).catch(() => null);
      if (!st || !st.isDirectory()) {
        logWarn(
          "build:packs",
          `${pack.name}: source directory missing (${pack.sourceDir}); skipping.`,
        );
        skipped += 1;
        continue;
      }

      if (await isEmptyDir(srcAbs)) {
        log("build:packs", `${color.gray(pack.name.padEnd(22))} ${color.gray("(empty, skipped)")}`);
        skipped += 1;
        continue;
      }

      await buildOne(pack, srcAbs, dstAbs);
      built += 1;
      log("build:packs", `${color.bold(pack.name.padEnd(22))} ${color.green("compiled")}`);
    } catch (err) {
      failed += 1;
      logError("build:packs", `${pack.name}: ${(err as Error).message}`);
    }
  }

  log(
    "build:packs",
    `${color.bold("Done.")} ${built} built, ${skipped} skipped, ${failed === 0 ? color.green("0 failed") : color.red(`${failed} failed`)}.`,
  );

  if (failed > 0) process.exit(1);
}

void main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
