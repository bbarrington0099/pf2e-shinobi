import { MODULE_TITLE } from "./constants.js";
import { SETTINGS, getSetting } from "./settings.js";

/**
 * Small logging helper that prefixes every message with the module title and
 * silences debug output unless the `debugLogging` setting is enabled.
 */
export const logger = {
  info(...args: unknown[]): void {
    console.log(`[${MODULE_TITLE}]`, ...args);
  },
  warn(...args: unknown[]): void {
    console.warn(`[${MODULE_TITLE}]`, ...args);
  },
  error(...args: unknown[]): void {
    console.error(`[${MODULE_TITLE}]`, ...args);
  },
  debug(...args: unknown[]): void {
    try {
      if (!getSetting<boolean>(SETTINGS.debugLogging)) return;
    } catch {
      return;
    }
    console.debug(`[${MODULE_TITLE}]`, ...args);
  },
};
