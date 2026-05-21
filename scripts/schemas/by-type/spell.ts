import type { Schema } from "ajv";

/**
 * Schema mirroring PF2e v7.x spell documents (Item with `type: "spell"`).
 *
 * Spell shapes vary widely (rituals, focus spells, cantrips, slot spells,
 * spells with overlays). We require the structural skeleton common to all
 * and let per-spell quirks live in `overlays` and `rules`.
 */
export const spellSchema: Schema = {
  type: "object",
  required: ["name", "type", "system"],
  additionalProperties: true,
  properties: {
    name: { type: "string", minLength: 1 },
    type: { const: "spell" },
    system: {
      type: "object",
      required: ["description", "duration", "level", "range", "rules", "target", "time", "traits"],
      additionalProperties: true,
      properties: {
        area: {
          type: ["object", "null"],
          properties: {
            type: { type: "string" },
            value: { type: ["integer", "string"] },
          },
        },
        cost: {
          type: "object",
          properties: { value: { type: "string" } },
        },
        counteraction: { type: "boolean" },
        damage: { type: "object" },
        defense: {
          type: ["object", "null"],
          properties: {
            save: {
              type: "object",
              properties: {
                basic: { type: "boolean" },
                statistic: {
                  type: "string",
                  enum: ["fortitude", "reflex", "will"],
                },
              },
            },
            passive: { type: "object" },
          },
        },
        description: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "string" } },
        },
        duration: {
          type: "object",
          required: ["value"],
          properties: {
            sustained: { type: "boolean" },
            value: { type: "string" },
          },
        },
        level: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "integer", minimum: 0, maximum: 10 } },
        },
        overlays: { type: "object" },
        publication: {
          type: "object",
          required: ["license", "remaster", "title"],
          properties: {
            license: { type: "string" },
            remaster: { type: "boolean" },
            title: { type: "string" },
          },
        },
        range: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "string" } },
        },
        requirements: { type: "string" },
        rules: { type: "array" },
        target: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "string" } },
        },
        time: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "string" } },
        },
        traits: {
          type: "object",
          required: ["rarity", "traditions", "value"],
          properties: {
            rarity: { type: "string", enum: ["common", "uncommon", "rare", "unique"] },
            traditions: { type: "array", items: { type: "string" } },
            value: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  },
};
