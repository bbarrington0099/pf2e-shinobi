/**
 * Stable identifiers used across the module. Keep in sync with `module.json`.
 */
export const MODULE_ID = "pf2e-shinobi" as const;
export const MODULE_TITLE = "PF2e Shinobi" as const;

/**
 * Helper to namespace a sub-key under the module ID (e.g. for settings,
 * localization keys, or flag scopes).
 */
export function ns(key: string): string {
  return `${MODULE_ID}.${key}`;
}
