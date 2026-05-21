/**
 * Shared structural schema for a single compendium document JSON file.
 *
 * Per-Item-type validation (ancestry `system.size`, heritage `system.ancestry`,
 * etc.) lives in `scripts/schemas/by-type/`. This schema only enforces
 * invariants common to every document.
 *
 * We keep the base schema permissive on purpose: PF2e's data model changes
 * between versions and we don't want to fight the system schema. Hard rules:
 *   - `name` is a non-empty string.
 *   - `type` is a non-empty string (validated against pack-specific allow
 *     lists elsewhere).
 *   - `system` is an object.
 *   - `_id`, if present, is exactly 16 alphanumeric chars (Foundry convention).
 *   - `folder`, if present, is either an _id-shaped string or null (compiled
 *     packs use null for the top level).
 */

import type { Schema } from "ajv";

export const documentSchema: Schema = {
  type: "object",
  required: ["name", "type", "system"],
  additionalProperties: true,
  properties: {
    name: { type: "string", minLength: 1 },
    type: { type: "string", minLength: 1 },
    system: { type: "object" },
    _id: { type: "string", pattern: "^[A-Za-z0-9]{16}$" },
    img: { type: "string" },
    folder: { type: ["string", "null"] },
    sort: { type: "number" },
    ownership: { type: "object" },
    flags: { type: "object" },
    effects: { type: "array" },
    items: { type: ["array", "object"] },
  },
};

/**
 * Schema for `_folders.json` entries that the Foundry CLI uses to define
 * the in-compendium folder structure.
 */
export const folderSchema: Schema = {
  type: "object",
  required: ["_id", "name", "type"],
  additionalProperties: true,
  properties: {
    _id: { type: "string", pattern: "^[A-Za-z0-9]{16}$" },
    name: { type: "string", minLength: 1 },
    type: { type: "string", minLength: 1 },
    color: { type: ["string", "null"] },
    folder: { type: ["string", "null"] },
    sort: { type: "number" },
    sorting: { type: "string" },
    flags: { type: "object" },
    description: { type: "string" },
  },
};
