import type { Schema } from "ajv";

/**
 * Schema mirroring PF2e v7.x effect documents (Item with `type: "effect"`).
 *
 * Effects are short- to medium-duration buffs/debuffs granted by spells,
 * equipment, feats, or actor abilities. They commonly include a duration,
 * rules array (status modifiers, damage dice, sense grants, etc.), and an
 * optional badge for counter-style UI elements.
 *
 * Note: upstream effect traits do NOT include `rarity` (only `value`), so
 * we keep `rarity` optional here in contrast with ancestry/heritage/feat/
 * class schemas where it is required.
 */
export const effectSchema: Schema = {
  type: "object",
  required: ["name", "type", "system"],
  additionalProperties: true,
  properties: {
    name: { type: "string", minLength: 1 },
    type: { const: "effect" },
    system: {
      type: "object",
      required: ["description", "duration", "level", "rules", "start", "tokenIcon", "traits"],
      additionalProperties: true,
      properties: {
        badge: {
          type: "object",
          properties: {
            labels: { type: "array", items: { type: "string" } },
            loop: { type: "boolean" },
            type: { type: "string", enum: ["counter", "value", "formula"] },
            value: { type: ["integer", "string"] },
          },
        },
        description: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "string" } },
        },
        duration: {
          type: "object",
          required: ["expiry", "sustained", "unit", "value"],
          properties: {
            expiry: {
              type: ["string", "null"],
              enum: ["turn-start", "turn-end", "round-end", null],
            },
            sustained: { type: "boolean" },
            unit: {
              type: "string",
              enum: ["rounds", "minutes", "hours", "days", "encounter", "unlimited"],
            },
            value: { type: "integer", minimum: -1 },
          },
        },
        level: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "integer", minimum: 0, maximum: 20 } },
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
        start: {
          type: "object",
          required: ["value"],
          properties: {
            initiative: { type: ["integer", "null"] },
            value: { type: "integer" },
          },
        },
        tokenIcon: {
          type: "object",
          required: ["show"],
          properties: { show: { type: "boolean" } },
        },
        traits: {
          type: "object",
          required: ["value"],
          properties: {
            rarity: { type: "string", enum: ["common", "uncommon", "rare", "unique"] },
            value: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  },
};
