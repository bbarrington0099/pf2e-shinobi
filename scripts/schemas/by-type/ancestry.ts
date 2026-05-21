import type { Schema } from "ajv";

const attributes = ["str", "dex", "con", "int", "wis", "cha"] as const;

const boostSlot: Schema = {
  type: "object",
  required: ["value"],
  additionalProperties: false,
  properties: {
    value: {
      type: "array",
      items: { type: "string", enum: [...attributes] },
      uniqueItems: true,
    },
  },
};

/**
 * Schema mirroring PF2e v7.x ancestry documents (Item with `type: "ancestry"`).
 *
 * Required `system` keys reflect the upstream `pf2e/packs/pf2e/ancestries/*.json`
 * shape so the Foundry CLI's `compilePack` and the system's data preparation
 * both accept our output without manual repair.
 */
export const ancestrySchema: Schema = {
  type: "object",
  required: ["name", "type", "system"],
  additionalProperties: true,
  properties: {
    name: { type: "string", minLength: 1 },
    type: { const: "ancestry" },
    system: {
      type: "object",
      required: [
        "additionalLanguages",
        "boosts",
        "description",
        "flaws",
        "hands",
        "hp",
        "items",
        "languages",
        "reach",
        "rules",
        "size",
        "speed",
        "traits",
        "vision",
      ],
      additionalProperties: true,
      properties: {
        additionalLanguages: {
          type: "object",
          required: ["count", "custom", "value"],
          properties: {
            count: { type: "integer", minimum: 0 },
            custom: { type: "string" },
            value: { type: "array", items: { type: "string" } },
          },
        },
        boosts: {
          type: "object",
          additionalProperties: false,
          properties: {
            "0": boostSlot,
            "1": boostSlot,
            "2": boostSlot,
          },
        },
        description: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "string" } },
        },
        flaws: {
          type: "object",
          additionalProperties: false,
          properties: {
            "0": boostSlot,
          },
        },
        hands: { type: "integer", minimum: 0, maximum: 8 },
        hp: { type: "integer", minimum: 1, maximum: 20 },
        items: { type: "object" },
        languages: {
          type: "object",
          required: ["custom", "value"],
          properties: {
            custom: { type: "string" },
            value: { type: "array", items: { type: "string" } },
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
        reach: { type: "integer", minimum: 0, maximum: 30 },
        rules: { type: "array" },
        size: { type: "string", enum: ["tiny", "sm", "med", "lg", "huge", "grg"] },
        speed: { type: "integer", minimum: 0, maximum: 120 },
        traits: {
          type: "object",
          required: ["rarity", "value"],
          properties: {
            rarity: { type: "string", enum: ["common", "uncommon", "rare", "unique"] },
            value: { type: "array", items: { type: "string" } },
          },
        },
        vision: {
          type: "string",
          enum: ["normal", "lowLight", "darkvision", "greaterDarkvision"],
        },
      },
    },
  },
};
