import { registerAutoSpellcasting } from "./auto-spellcasting.js";
import { MODULE_ID, MODULE_TITLE } from "./constants.js";
import { logger } from "./logger.js";
import { registerCustomTraits } from "./register-traits.js";
import { registerSettings } from "./settings.js";

/**
 * Public API surface exposed on `game.modules.get("pf2e-shinobi").api`.
 *
 * Kept intentionally minimal during Milestone 1; later milestones can attach
 * helpers (e.g. jutsu lookup, chakra utilities) here.
 */
export interface PF2eShinobiApi {
  readonly id: typeof MODULE_ID;
  readonly version: string;
}

Hooks.once("init", () => {
  logger.info(`Initializing ${MODULE_TITLE}`);
  registerSettings();
  registerCustomTraits();
});

Hooks.once("ready", () => {
  const moduleEntry = game.modules.get(MODULE_ID) as
    | { id: string; active: boolean; api?: PF2eShinobiApi; version?: string }
    | undefined;

  if (!moduleEntry) {
    logger.warn(`Module entry for "${MODULE_ID}" not found on ready.`);
    return;
  }

  const api: PF2eShinobiApi = {
    id: MODULE_ID,
    version: moduleEntry.version ?? "0.0.0",
  };
  moduleEntry.api = api;

  if (game.system?.id !== "pf2e") {
    logger.warn(
      `Active system is "${game.system?.id ?? "unknown"}"; ${MODULE_TITLE} expects the "pf2e" system.`,
    );
  }

  registerAutoSpellcasting();

  logger.info(`${MODULE_TITLE} ready (v${api.version}).`);
});
