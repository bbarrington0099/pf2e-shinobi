import type { Schema } from "ajv";

/**
 * Schema mirroring PF2e v7.x action documents (Item with `type: "action"`).
 *
 * Actions span basic, skill, class-granted, ancestry-granted and equipment-
 * triggered abilities. Pack-level constraints in `scripts/packs.config.ts`
 * decide which categories are legal in each module pack.
 */
export const actionSchema: Schema = {
  type: "object",
  required: ["name", "type", "system"],
  additionalProperties: true,
  properties: {
    name: { type: "string", minLength: 1 },
    type: { const: "action" },
    system: {
      type: "object",
      required: ["actionType", "actions", "description", "rules", "traits"],
      additionalProperties: true,
      properties: {
        actionType: {
          type: "object",
          required: ["value"],
          properties: {
            value: { type: "string", enum: ["action", "reaction", "free", "passive"] },
          },
        },
        actions: {
          type: "object",
          required: ["value"],
          properties: {
            value: { type: ["integer", "null"], minimum: 1, maximum: 3 },
          },
        },
        category: { type: ["string", "null"] },
        description: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "string" } },
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
