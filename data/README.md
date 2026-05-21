# `data/` &mdash; Compendium Source

This directory holds the **source of truth** for every compendium document the
module ships. The build pipeline (`npm run build`) reads JSON files from here
and compiles them into Foundry LevelDB packs under `packs/` (which is git-ignored
and regenerated from this folder).

## Layout

Each subdirectory matches a pack `name` declared in [`module.json`](../module.json)
and [`scripts/packs.config.ts`](../scripts/packs.config.ts):

| Subdirectory          | Pack                  | Allowed `type` values                                                |
| --------------------- | --------------------- | -------------------------------------------------------------------- |
| `ancestries/`         | Shinobi Clans         | `ancestry`                                                           |
| `ancestry-features/`  | Shinobi Clan Features | `feat`, `action`                                                     |
| `heritages/`          | Bloodline Heritages   | `heritage`                                                           |
| `heritage-actions/`   | Heritage Actions      | `action`                                                             |
| `backgrounds/`        | Backgrounds           | `background`                                                         |
| `background-actions/` | Background Actions    | `action`                                                             |
| `classes/`            | Specializations       | `class`                                                              |
| `class-features/`     | Class Features        | `feat`                                                               |
| `class-actions/`      | Class Actions         | `action`                                                             |
| `feats/`              | General Feats         | `feat`                                                               |
| `spells/`             | Jutsu                 | `spell`                                                              |
| `spell-actions/`      | Jutsu Actions         | `action`                                                             |
| `spell-effects/`      | Jutsu Effects         | `effect`                                                             |
| `equipment/`          | Equipment             | `equipment`, `weapon`, `armor`, `consumable`, `treasure`, `backpack` |
| `equipment-actions/`  | Equipment Actions     | `action`                                                             |
| `equipment-effects/`  | Equipment Effects     | `effect`                                                             |
| `deities/`            | Paths & Legends       | `deity`                                                              |
| `familiar-abilities/` | Familiar Abilities    | `action`, `feat`                                                     |
| `ac-ancestries/`      | Companion Ancestries  | `ancestry`, `feat`                                                   |
| `ac-feats/`           | Companion Feats       | `feat`                                                               |
| `ac-adv-maneuvers/`   | Companion Maneuvers   | `action`                                                             |
| `ac-support/`         | Companion Support     | `feat`                                                               |
| `effects/`            | Misc Effects          | `effect`                                                             |

## File conventions

- One JSON file per document. Filename should be the slug of the document name
  (e.g. `uchiha-clan.json`).
- Every document **must** include `name`, `type`, and a `system` block. The
  validator additionally enforces:
  - `type` is one of the values allowed for the parent pack (see table above).
  - `_id` (if provided) is a 16-character alphanumeric string.
  - `img` (if provided) points to a path inside `assets/` or the PF2e system.
- Refer to the PF2e system's own `packs/` directory for canonical examples of
  each Item type. Run `npm run extract:packs` to copy them locally for
  reference.

## Adding a new document

1. Create the JSON file under the appropriate subdirectory.
2. Run `npm run validate` to type-check and schema-check it.
3. Run `npm run build:packs` to compile the LevelDB output.

## Status: Milestone 1

These subdirectories are intentionally empty in the Milestone 1 scaffold.
Content authoring begins in Milestone 2 (clans/ancestries) per
[`DEVELOPMENT.md`](../DEVELOPMENT.md).
