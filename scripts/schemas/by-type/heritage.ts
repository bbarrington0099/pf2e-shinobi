import type { Schema } from "ajv";

/**
 * Schema mirroring PF2e v7.x heritage documents.
 *
 * Heritages link to a parent ancestry via `system.ancestry.uuid`. The
 * cross-pack reference is enforced separately in `scripts/validate.ts` after
 * all packs are loaded.
 */
export const heritageSchema: Schema = {
  type: "object",
  required: ["name", "type", "system"],
  additionalProperties: true,
  properties: {
    name: { type: "string", minLength: 1 },
    type: { const: "heritage" },
    system: {
      type: "object",
      required: ["ancestry", "description", "rules", "traits"],
      additionalProperties: true,
      properties: {
        ancestry: {
          type: "object",
          required: ["name", "slug", "uuid"],
          properties: {
            name: { type: "string", minLength: 1 },
            slug: { type: "string", pattern: "^[a-z0-9-]+$" },
            uuid: {
              type: "string",
              pattern: "^Compendium\\.[a-zA-Z0-9-]+\\.[a-zA-Z0-9-]+\\.Item\\.[A-Za-z0-9]{16}$",
            },
          },
        },
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
