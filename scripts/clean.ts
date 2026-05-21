import { rm } from "node:fs/promises";
import { fromRoot, log } from "./utils.ts";

/**
 * Removes generated artifacts. Source under `src/`, `data/`, and `scripts/`
 * is never touched.
 */
async function main(): Promise<void> {
  const targets = ["dist", "packs", "release"];
  for (const target of targets) {
    const abs = fromRoot(target);
    await rm(abs, { recursive: true, force: true });
    log("clean", `removed ${target}/`);
  }
}

void main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
