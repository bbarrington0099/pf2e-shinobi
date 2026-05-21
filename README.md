# PF2e Shinobi

A Naruto-themed content module for the [Pathfinder Second Edition (PF2e)](https://foundryvtt.com/packages/pf2e) system on [Foundry VTT V13](https://foundryvtt.com/). All content is delivered through compendium packs (clans, bloodlines, village backgrounds, specializations, jutsu, shinobi tools, companions, and supporting feats/effects) &mdash; nothing is hard-coded or UI-entered.

> **Status:** Milestone 1 &mdash; infrastructure scaffold. The data directories are intentionally empty; content authoring begins in Milestone 2. See [`DEVELOPMENT.md`](./DEVELOPMENT.md) for the full plan.

## Requirements

- [Node.js](https://nodejs.org/) **20 LTS** or newer (uses `--experimental-strip-types` for TS build scripts)
- [Foundry VTT](https://foundryvtt.com/) **v13** with the **PF2e** system installed

## Quick start

```bash
git clone https://github.com/bbarrington0099/pf2e-shinobi.git
cd pf2e-shinobi
npm install
npm run build
```

The build produces:

- `dist/pf2e-shinobi.js` &mdash; bundled module runtime (referenced by `module.json`).
- `packs/<pack-name>/` &mdash; one Foundry LevelDB pack per compendium (regenerated from `data/`).

## Repository layout

| Path                                                       | Purpose                                                  |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| `module.json`                                              | Foundry module manifest (V13).                           |
| `package.json`                                             | npm scripts and dev dependencies.                        |
| `tsconfig.json`, `tsconfig.scripts.json`, `vite.config.ts` | TypeScript + Vite build config.                          |
| `src/`                                                     | Module runtime code (TypeScript, ES modules).            |
| `scripts/`                                                 | Build / validate / extract / release automation.         |
| `scripts/packs.config.ts`                                  | Single source of truth for pack metadata.                |
| `data/<pack>/`                                             | Authoring source: one JSON file per compendium document. |
| `packs/<pack>/`                                            | **Generated** LevelDB output (git-ignored).              |
| `lang/`                                                    | Localization JSON files.                                 |
| `tests/`                                                   | Jest unit tests.                                         |
| `.github/workflows/`                                       | CI (`ci.yml`) and release (`release.yml`) pipelines.     |

## npm scripts

| Script                            | What it does                                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `npm run validate`                | Schema-checks every JSON file under `data/` and enforces `module.json` &harr; `packs.config.ts` parity.              |
| `npm run build:code`              | Bundles the TypeScript runtime with Vite into `dist/`.                                                               |
| `npm run build:packs`             | Compiles `data/<pack>/*.json` into Foundry LevelDB packs under `packs/<pack>/`.                                      |
| `npm run build`                   | `clean` &rarr; `validate` &rarr; `build:code` &rarr; `build:packs`.                                                  |
| `npm run extract:packs`           | Round-trip LevelDB packs back to JSON (set `SHINOBI_EXTRACT_SOURCE` to extract from another module's `packs/`).      |
| `npm run release:zip`             | Bundle `module.json`, `dist/`, `packs/`, `lang/`, `assets/`, `LICENSE`, `README.md` into `release/pf2e-shinobi.zip`. |
| `npm run lint` / `npm run format` | ESLint and Prettier.                                                                                                 |
| `npm test`                        | Run the Jest suite.                                                                                                  |

## Installing in Foundry (developer workflow)

1. Run `npm run build` so `dist/` and `packs/` exist locally.
2. Symlink or copy the repository into your Foundry `Data/modules/` folder as `pf2e-shinobi`.
3. Launch Foundry V13, enable the **PF2e Shinobi** module on your PF2e world, and reload.

## Installing in Foundry (end users)

Once a release tag has been published, paste the manifest URL into Foundry's **Install Module** dialog:

```
https://github.com/bbarrington0099/pf2e-shinobi/releases/latest/download/module.json
```

This works the same on The Forge: add the manifest URL to your hosted instance via _Setup &rarr; Modules &rarr; Install Module_.

## Authoring new content

1. Pick the appropriate `data/<pack>/` directory (see [`data/README.md`](./data/README.md)).
2. Create one JSON file per document. Filename should be the slug of the document name (e.g. `data/spells/chidori.json`).
3. Run `npm run validate` to catch schema problems early.
4. Run `npm run build:packs` to compile the LevelDB output.
5. Restart Foundry (or use the _Reload_ button in the compendium sidebar) to see the changes.

## Releasing

Releases are driven entirely by git tags:

1. Bump `version` in `module.json` **and** `package.json` to the next semver value.
2. Commit and tag the same commit with `vX.Y.Z` (matching the new version exactly).
3. Push the tag. The [`release.yml`](./.github/workflows/release.yml) workflow validates that the tag and manifest agree, builds, packages `release/pf2e-shinobi.zip`, and attaches both the zip and `module.json` to a new GitHub Release.

Foundry / The Forge will see the updated manifest at the stable `releases/latest/download/module.json` URL.

## License

[MIT](./LICENSE). This is an unofficial fan work; Naruto and PF2e trademarks belong to their respective owners (see the LICENSE file for the full notice).
