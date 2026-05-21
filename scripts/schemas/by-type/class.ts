import type { Schema } from "ajv";

const attributes = ["str", "dex", "con", "int", "wis", "cha"] as const;
const PROFICIENCY = { type: "integer", minimum: 0, maximum: 4 } as const;
const LEVEL_LIST = {
  type: "object",
  required: ["value"],
  properties: {
    value: {
      type: "array",
      items: { type: "integer", minimum: 1, maximum: 20 },
      uniqueItems: true,
    },
  },
} as const;

/**
 * Schema mirroring PF2e v7.x class documents (Item with `type: "class"`).
 *
 * Required `system` keys reflect the upstream `pf2e/packs/pf2e/classes/*.json`
 * shape. The validator additionally cross-checks `system.items[*].uuid`
 * against the class-features pack in `scripts/validate.ts`.
 */
export const classSchema: Schema = {
  type: "object",
  required: ["name", "type", "system"],
  additionalProperties: true,
  properties: {
    name: { type: "string", minLength: 1 },
    type: { const: "class" },
    system: {
      type: "object",
      required: [
        "ancestryFeatLevels",
        "attacks",
        "classFeatLevels",
        "defenses",
        "description",
        "generalFeatLevels",
        "hp",
        "items",
        "keyAbility",
        "perception",
        "rules",
        "savingThrows",
        "skillFeatLevels",
        "skillIncreaseLevels",
        "spellcasting",
        "trainedSkills",
        "traits",
      ],
      additionalProperties: true,
      properties: {
        ancestryFeatLevels: LEVEL_LIST,
        attacks: {
          type: "object",
          required: ["advanced", "martial", "other", "simple", "unarmed"],
          properties: {
            advanced: PROFICIENCY,
            martial: PROFICIENCY,
            simple: PROFICIENCY,
            unarmed: PROFICIENCY,
            other: {
              type: "object",
              required: ["name", "rank"],
              properties: {
                name: { type: "string" },
                rank: PROFICIENCY,
              },
            },
          },
        },
        classFeatLevels: LEVEL_LIST,
        defenses: {
          type: "object",
          required: ["heavy", "light", "medium", "unarmored"],
          properties: {
            heavy: PROFICIENCY,
            light: PROFICIENCY,
            medium: PROFICIENCY,
            unarmored: PROFICIENCY,
          },
        },
        description: {
          type: "object",
          required: ["value"],
          properties: { value: { type: "string" } },
        },
        generalFeatLevels: LEVEL_LIST,
        hp: { type: "integer", enum: [6, 8, 10, 12] },
        items: { type: "object" },
        keyAbility: {
          type: "object",
          required: ["value"],
          properties: {
            value: {
              type: "array",
              items: { type: "string", enum: [...attributes] },
              minItems: 1,
              uniqueItems: true,
            },
          },
        },
        perception: PROFICIENCY,
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
        savingThrows: {
          type: "object",
          required: ["fortitude", "reflex", "will"],
          properties: {
            fortitude: PROFICIENCY,
            reflex: PROFICIENCY,
            will: PROFICIENCY,
          },
        },
        skillFeatLevels: LEVEL_LIST,
        skillIncreaseLevels: LEVEL_LIST,
        spellcasting: PROFICIENCY,
        trainedSkills: {
          type: "object",
          required: ["additional", "value"],
          properties: {
            additional: { type: "integer", minimum: 0, maximum: 6 },
            value: { type: "array", items: { type: "string" } },
          },
        },
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
