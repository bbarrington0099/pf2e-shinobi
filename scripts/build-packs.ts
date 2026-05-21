import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { compilePack } from "@foundryvtt/foundryvtt-cli";

import { PACKS } from "./packs.config.ts";
import { color, fromRoot, log, logError, logWarn } from "./utils.ts";

/**
 * Build every compendium pack declared in `packs.config.ts`.
 *
 * For each pack:
 *   1. Ensures the source directory exists (skips with a warning if it's
 *      empty so that an empty Milestone 1 scaffold can still build cleanly).
 *   2. Removes any prior LevelDB output.
 *   3. Compiles the JSON source into a Foundry LevelDB pack.
 */
async function isEmptyDir(path: string): Promise<boolean> {
  try {
    const entries = await readdir(path);
    return entries.every((e) => e.startsWith("."));
  } catch {
    return true;
  }
}

async function buildOne(srcAbs: string, dstAbs: string): Promise<void> {
  await rm(dstAbs, { recursive: true, force: true });
  await mkdir(dstAbs, { recursive: true });
  await compilePack(srcAbs, dstAbs, { recursive: true, log: false });
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

      await buildOne(srcAbs, dstAbs);
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
