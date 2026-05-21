import { mkdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { spawn } from "node:child_process";

import { ROOT, color, fromRoot, log, logError } from "./utils.ts";

/**
 * Bundle the buildable artifacts (`module.json`, `dist/`, `packs/`, `lang/`,
 * `assets/`, `LICENSE`, `README.md`) into a zip under `release/`.
 *
 * The Foundry wiki recommends naming the archive `<id>.zip` and shipping
 * `module.json` as a separate release asset. CI consumes both.
 *
 * Shells out to `zip` on POSIX and `Compress-Archive` on Windows to keep the
 * runtime dependency footprint small. GitHub-hosted runners provide both.
 */

interface ModuleJson {
  id: string;
  version: string;
}

async function readModuleJson(): Promise<ModuleJson> {
  return JSON.parse(await readFile(fromRoot("module.json"), "utf8")) as ModuleJson;
}

function runZip(zipPath: string, files: string[], cwd: string): Promise<void> {
  return new Promise((resolvePromise, rejectPromise) => {
    const isWin = process.platform === "win32";
    const child = isWin
      ? spawn(
          "powershell",
          [
            "-NoProfile",
            "-Command",
            `Compress-Archive -Path ${files.map((f) => `'${f}'`).join(",")} -DestinationPath '${zipPath}' -Force`,
          ],
          { cwd, stdio: "inherit" },
        )
      : spawn("zip", ["-r", zipPath, ...files], { cwd, stdio: "inherit" });

    child.on("error", rejectPromise);
    child.on("exit", (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`zip exited with code ${code ?? "null"}`));
    });
  });
}

async function main(): Promise<void> {
  const moduleJson = await readModuleJson();
  const releaseDir = fromRoot("release");
  await mkdir(releaseDir, { recursive: true });

  const zipName = `${moduleJson.id}.zip`;
  const zipPath = join(releaseDir, zipName);

  const candidates = ["module.json", "dist", "packs", "lang", "assets", "LICENSE", "README.md"];
  const existing: string[] = [];
  for (const entry of candidates) {
    try {
      await stat(fromRoot(entry));
      existing.push(entry);
    } catch {
      // Optional inputs (e.g. `assets/`) may not exist; skip silently.
    }
  }

  log("release", `Creating ${color.bold(zipName)} from: ${existing.join(", ")}`);
  await runZip(zipPath, existing, ROOT);
  log("release", `${color.green("Created")} ${relative(ROOT, zipPath).replace(/\\/g, "/")}`);
}

void main().catch((err: unknown) => {
  logError("release", (err as Error).message);
  process.exit(1);
});
