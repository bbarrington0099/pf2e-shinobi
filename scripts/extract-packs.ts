import { mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { extractPack } from "@foundryvtt/foundryvtt-cli";

import { PACKS } from "./packs.config.ts";
import { color, fromRoot, log, logError } from "./utils.ts";

/**
 * Reverse of `build-packs.ts`. Given existing LevelDB pack folders under
 * `packs/`, write JSON source files back into `data/`. Useful when authoring
 * content in Foundry's UI and round-tripping it into the source tree, or
 * when bootstrapping from another module's packs (pointed at via the
 * SHINOBI_EXTRACT_SOURCE env var).
 */
async function main(): Promise<void> {
  const overrideSource = process.env.SHINOBI_EXTRACT_SOURCE;
  let extracted = 0;
  let failed = 0;

  for (const pack of PACKS) {
    const srcAbs = overrideSource ? resolve(overrideSource, pack.name) : fromRoot(pack.outputDir);
    const dstAbs = fromRoot(pack.sourceDir);

    try {
      const st = await stat(srcAbs).catch(() => null);
      if (!st || !st.isDirectory()) {
        log(
          "extract:packs",
          `${color.gray(pack.name.padEnd(22))} ${color.gray("(no input, skipped)")}`,
        );
        continue;
      }
      await mkdir(dstAbs, { recursive: true });
      await extractPack(srcAbs, dstAbs, { log: false });
      extracted += 1;
      log("extract:packs", `${color.bold(pack.name.padEnd(22))} ${color.green("extracted")}`);
    } catch (err) {
      failed += 1;
      logError("extract:packs", `${pack.name}: ${(err as Error).message}`);
    }
  }

  log(
    "extract:packs",
    `${color.bold("Done.")} ${extracted} extracted, ${failed === 0 ? color.green("0 failed") : color.red(`${failed} failed`)}.`,
  );
  if (failed > 0) process.exit(1);
}

void main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
