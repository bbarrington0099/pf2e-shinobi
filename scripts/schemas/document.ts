/**
 * Shared structural schema for a single compendium document JSON file.
 *
 * Per-Item-type validation (e.g. ancestry `system.size`, class `system.hp`)
 * lives in `scripts/schemas/by-type/`. This schema only enforces invariants
 * common to every document.
 *
 * We keep the schema permissive on purpose: PF2e's data model changes between
 * versions and we don't want to fight the system schema. Hard rules:
 *   - `name` is a non-empty string.
 *   - `type` is a non-empty string (validated against pack-specific allow lists
 *     elsewhere).
 *   - `system` is an object.
 *   - `_id`, if present, is exactly 16 alphanumeric chars (Foundry convention).
 */

import type { JSONSchemaType } from "ajv";

export interface CompendiumDocument {
  name: string;
  type: string;
  system: Record<string, unknown>;
  _id?: string;
  img?: string;
  folder?: string | null;
  sort?: number;
  ownership?: Record<string, number>;
  flags?: Record<string, unknown>;
  effects?: unknown[];
  items?: unknown[];
}

export const documentSchema: JSONSchemaType<CompendiumDocument> = {
  type: "object",
  required: ["name", "type", "system"],
  additionalProperties: true,
  properties: {
    name: { type: "string", minLength: 1 },
    type: { type: "string", minLength: 1 },
    system: { type: "object", additionalProperties: true, required: [] },
    _id: {
      type: "string",
      pattern: "^[A-Za-z0-9]{16}$",
      nullable: true,
    },
    img: { type: "string", nullable: true },
    folder: { type: "string", nullable: true },
    sort: { type: "number", nullable: true },
    ownership: {
      type: "object",
      additionalProperties: { type: "number" },
      nullable: true,
      required: [],
    },
    flags: { type: "object", additionalProperties: true, nullable: true, required: [] },
    effects: { type: "array", nullable: true, items: {} as never },
    items: { type: "array", nullable: true, items: {} as never },
  },
};
