import type { Schema } from "ajv";

import { documentSchema, folderSchema } from "./document.ts";
import { actionSchema } from "./by-type/action.ts";
import { ancestrySchema } from "./by-type/ancestry.ts";
import { classSchema } from "./by-type/class.ts";
import { effectSchema } from "./by-type/effect.ts";
import { featSchema } from "./by-type/feat.ts";
import { heritageSchema } from "./by-type/heritage.ts";
import { spellSchema } from "./by-type/spell.ts";

/**
 * Mapping of PF2e Item `type` values to a tightened schema. Types absent from
 * the map fall back to `documentSchema` (structural checks only).
 *
 * As later milestones add support for more item types (background, equipment,
 * deity, effect), add their schemas under `scripts/schemas/by-type/` and
 * register them here.
 */
export const schemasByType: Record<string, Schema> = {
  action: actionSchema,
  ancestry: ancestrySchema,
  class: classSchema,
  effect: effectSchema,
  feat: featSchema,
  heritage: heritageSchema,
  spell: spellSchema,
};

export { documentSchema, folderSchema };
