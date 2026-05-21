import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

/**
 * Absolute path to the repository root, regardless of where the script is invoked.
 *
 * Scripts in this directory live one level below the root.
 */
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function fromRoot(...segments: string[]): string {
  return resolve(ROOT, ...segments);
}

/**
 * ANSI helpers for legible CI output. Colors are stripped automatically when
 * stdout is not a TTY.
 */
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const wrap = (code: number) => (s: string) => (useColor ? `\u001b[${code}m${s}\u001b[0m` : s);

export const color = {
  green: wrap(32),
  red: wrap(31),
  yellow: wrap(33),
  cyan: wrap(36),
  gray: wrap(90),
  bold: wrap(1),
};

export function log(prefix: string, ...args: unknown[]): void {
  console.log(color.cyan(`[${prefix}]`), ...args);
}

export function logError(prefix: string, ...args: unknown[]): void {
  console.error(color.red(`[${prefix}]`), ...args);
}

export function logWarn(prefix: string, ...args: unknown[]): void {
  console.warn(color.yellow(`[${prefix}]`), ...args);
}
