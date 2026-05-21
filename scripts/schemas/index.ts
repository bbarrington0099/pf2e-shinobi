import type { Schema } from "ajv";

import { documentSchema, folderSchema } from "./document.ts";
import { ancestrySchema } from "./by-type/ancestry.ts";
import { featSchema } from "./by-type/feat.ts";
import { heritageSchema } from "./by-type/heritage.ts";

/**
 * Mapping of PF2e Item `type` values to a tightened schema. Types absent from
 * the map fall back to `documentSchema` (structural checks only).
 *
 * As later milestones add support for more item types (spell, class,
 * background, equipment, action, deity, effect), add their schemas under
 * `scripts/schemas/by-type/` and register them here.
 */
export const schemasByType: Record<string, Schema> = {
  ancestry: ancestrySchema,
  feat: featSchema,
  heritage: heritageSchema,
};

export { documentSchema, folderSchema };
