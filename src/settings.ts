import { MODULE_ID } from "./constants.js";

/**
 * Module settings keys. Centralized so callers don't sprinkle string literals.
 */
export const SETTINGS = {
  debugLogging: "debugLogging",
} as const;

export type SettingKey = (typeof SETTINGS)[keyof typeof SETTINGS];

/**
 * Register all module settings. Called from the `init` hook.
 *
 * Keep registrations declarative and small; richer config UIs (FormApplication
 * subclasses) belong in their own files.
 */
export function registerSettings(): void {
  game.settings.register(MODULE_ID, SETTINGS.debugLogging, {
    name: `${MODULE_ID}.settings.debugLogging.name`,
    hint: `${MODULE_ID}.settings.debugLogging.hint`,
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
  });
}

export function getSetting<T>(key: SettingKey): T {
  return game.settings.get(MODULE_ID, key) as T;
}
