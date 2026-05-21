import type { Schema } from "ajv";

/**
 * Schema mirroring PF2e v7.x feat documents.
 *
 * "Ancestry features" in PF2e are Items with `type: "feat"` and
 * `system.category: "ancestryfeature"`. The same shape covers class features,
 * general feats, skill feats, and ancestry feats; pack-level allow lists in
 * `scripts/packs.config.ts` constrain which categories are legal per pack.
 */
export const featSchema: Schema = {
  type: "object",
  required: ["name", "type", "system"],
  additionalProperties: true,
  properties: {
    name: { type: "string", minLength: 1 },
    type: { const: "feat" },
    system: {
      type: "object",
      required: ["actionType", "actions", "category", "description", "level", "rules", "traits"],
      additionalProperties: true,
      properties: {
        actionType: {
          type: "object",
          required: ["value"],
          properties: {
            value: {
              type: "string",
              enum: ["action", "reaction", "free", "passive"],
            },
          },
        },
        actions: {
          type: "object",
          required: ["value"],
          properties: {
            value: { type: ["integer", "null"], minimum: 1, maximum: 3 },
          },
        },
        category: {
          type: "string",
          enum: [
            "ancestry",
            "ancestryfeature",
            "bonus",
            "calling",
            "class",
            "classfeature",
            "curse",
            "deityboon",
            "general",
            "pfsboon",
            "skill",
          ],
        },
        description: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "string" } },
        },
        level: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "integer", minimum: 0, maximum: 20 } },
        },
        prerequisites: {
          type: "object",
          properties: {
            value: {
              type: "array",
              items: {
                type: "object",
                required: ["value"],
                properties: { value: { type: "string" } },
              },
            },
          },
        },
        publication: {
          type: "object",
          required: ["license", "remaster", "title"],
          properties: {
            license: { type: "string" },
            remaster: { type: "boolean" },
            title: { type: "string" },
          },
        },
        rules: { type: "array" },
        traits: {
          type: "object",
          required: ["rarity", "value"],
          properties: {
            rarity: { type: "string", enum: ["common", "uncommon", "rare", "unique"] },
            value: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  },
};
