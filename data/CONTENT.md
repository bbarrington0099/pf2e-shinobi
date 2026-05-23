# Authored content index

This file is a human-readable register of every compendium document the
module ships, the `_id` allocated to it, and any cross-pack references
between them. Keep it updated when you add or rename content — the parity
tests in `tests/` rely on slugs but reviewers rely on this register.

## ID allocation scheme

All `_id` values are exactly 16 alphanumeric characters and use a stable
4-character type prefix:

| Prefix | Document type                   |
| ------ | ------------------------------- |
| `Ance` | Ancestry                        |
| `Heri` | Heritage                        |
| `AnFt` | Ancestry feature (`type: feat`) |
| `Clss` | Class                           |
| `ClFt` | Class feature (`type: feat`)    |
| `ClAc` | Class action (`type: action`)   |
| `Spll` | Spell                           |
| `Effc` | Spell-effect / effect           |
| `Fldr` | Folder in `heritages/`          |
| `FldA` | Folder in `ancestry-features/`  |
| `FldC` | Folder in `class-features/`     |
| `FldX` | Folder in `class-actions/`      |
| `FldS` | Folder in `spells/`             |
| `FldE` | Folder in `spell-effects/`      |

### Spell `_id` sub-scheme

Spell IDs use a 2-character school/element prefix inside the 16-char ID to
keep them grouped at a glance:

| Sub-prefix | School / Element        |
| ---------- | ----------------------- |
| `Ac`       | Academy cantrips        |
| `Ka`       | Katon (Fire)            |
| `Fu`       | Fūton (Wind)            |
| `Ra`       | Raiton (Lightning)      |
| `Sw`       | Suiton (Water)          |
| `Do`       | Doton (Earth)           |
| `Nj`       | Ninjutsu (non-element)  |
| `Gn`       | Genjutsu                |
| `Md`       | Medical                 |
| `Ks`       | Kuchiyose (Summoning)   |
| `Fj`       | Fūinjutsu               |
| `Sp`       | Special / Kekkei Genkai |

The three Charge Chakra variants (`SpllChargChakra0`, `SpllChrgChak2nd0`,
`SpllChrgChak3rd0`) predate the sub-scheme and live in the
`Focus / Chakra Management` folder.

Future milestones will add `Back` (background), `Feat` (general feat),
`Equp` (equipment), `Deit` (deity), and similar prefixes.

## Milestone 2: Clans, Heritages, Ancestry Features

### Ancestries (`packs/ancestries`)

| Clan             | `_id`              | Locked boosts | Locked flaw | HP  | Speed | Vision   |
| ---------------- | ------------------ | ------------- | ----------- | --- | ----- | -------- |
| Uchiha           | `AnceUchihaClan00` | Dex, Cha      | Wis         | 8   | 25    | normal   |
| Hyūga            | `AnceHyugaClan001` | Dex, Wis      | Cha         | 8   | 25    | lowLight |
| Senju            | `AnceSenjuClan001` | Con, Wis      | Cha         | 10  | 25    | normal   |
| Uzumaki          | `AnceUzumakiCln00` | Con, Cha      | Str         | 10  | 25    | normal   |
| Aburame          | `AnceAburameCln00` | Int, Con      | Cha         | 8   | 25    | lowLight |
| Inuzuka          | `AnceInuzukaCln00` | Str, Dex      | Int         | 8   | 30    | lowLight |
| Nara             | `AnceNaraClan0001` | Int, Wis      | Str         | 6   | 25    | normal   |
| Akimichi         | `AnceAkimichiCl00` | Str, Con      | Dex         | 10  | 25    | normal   |
| Yamanaka         | `AnceYamanakaCl00` | Cha, Wis      | Con         | 6   | 25    | normal   |
| Hōzuki           | `AnceHozukiClan00` | Dex, Con      | Wis         | 8   | 25    | normal   |
| Civilian Shinobi | `AnceCivilianShnb` | (2 free)      | —           | 8   | 25    | normal   |

Each ancestry automatically grants its "Clan Training" ancestry feature
through `system.items`.

### Heritages (`packs/heritages`)

| Heritage              | `_id`              | Parent clan      | Notes (TODO marks balance items needing playtest)   |
| --------------------- | ------------------ | ---------------- | --------------------------------------------------- |
| Sharingan Awakened    | `HeriSharinganAwk` | Uchiha           | Grants `AnFtSharinganAwk`. TODO: precision wording. |
| Fire-Affinity Uchiha  | `HeriUchihaFireAf` | Uchiha           | +1 fire-trait damage. TODO: confirm scaling.        |
| Byakugan Born         | `HeriByakuganBorn` | Hyūga            | Grants `AnFtByakuganAble`. TODO: range of see-thru. |
| Side-Branch Hyūga     | `HeriSideBranchHy` | Hyūga            | Trained in Stealth. TODO: caged-bird seal flavor.   |
| Mokuton Latent        | `HeriMokutonLatnt` | Senju            | Trained in Nature. TODO: gate behind Senju cred.    |
| Iron-Bodied Senju     | `HeriIronBodiedSj` | Senju            | +2 max HP. TODO: stacking with class HP.            |
| Sealmaster Uzumaki    | `HeriSealmasterUz` | Uzumaki          | Trained in Arcana. TODO: connect to fūinjutsu.      |
| Long-Lived Uzumaki    | `HeriLongLivedUzu` | Uzumaki          | +2 saves vs disease/aging. TODO: lifespan flavor.   |
| Hive-Bonded Aburame   | `HeriHiveBondedAb` | Aburame          | Grants `AnFtBeetleSwarms`. TODO: insect minion HP.  |
| Beetle Hatchling      | `HeriBeetleHatchA` | Aburame          | Trained in Survival. TODO: minor.                   |
| Ninken-Partnered      | `HeriNinkenPartnr` | Inuzuka          | Bonus to Survival tracking. TODO: animal companion. |
| Beast-Stalker Inuzuka | `HeriBeastStalker` | Inuzuka          | Scent (imprecise 30 ft). TODO: confirm encounter.   |
| Shadow Imitator       | `HeriShadowImitat` | Nara             | Grants `AnFtShadowMimcry`. TODO: action economy.    |
| Strategist Nara       | `HeriStrategistNa` | Nara             | Bonus to Recall Knowledge. TODO: skill picks.       |
| Calorie Burner        | `HeriCalorieBurnr` | Akimichi         | Grants `AnFtCalorieFuel0`. TODO: starvation rules.  |
| Butterfly Akimichi    | `HeriButterflyAki` | Akimichi         | +5 ft burst speed 1/day. TODO: replenish.           |
| Mind-Walker Yamanaka  | `HeriMindWalkerYa` | Yamanaka         | Grants `AnFtMindIntrudr0`. TODO: telepathy range.   |
| Floral Yamanaka       | `HeriFloralYamank` | Yamanaka         | Trained in Diplomacy. TODO: alternate skill list.   |
| Hydrification Born    | `HeriHydrifctnBrn` | Hōzuki           | Grants `AnFtWaterBodyKnk`. TODO: damage immunity?   |
| Demon's Successor     | `HeriDemonSuccsr0` | Hōzuki           | +1 to Intimidation. TODO: mist village flavor.      |
| Skilled Recruit       | `HeriSkilledRcrut` | Civilian Shinobi | Mirrors PF2e _Skilled Human_.                       |
| Versatile Recruit     | `HeriVersatileRct` | Civilian Shinobi | Mirrors PF2e _Versatile Human_.                     |

### Ancestry features (`packs/ancestry-features`)

Each clan grants a "Clan Training" feature automatically. Heritages flagged
above grant their paired signature feature via `GrantItem`.

| Feature                | `_id`              | Clan             | Granted by              |
| ---------------------- | ------------------ | ---------------- | ----------------------- |
| Uchiha Clan Training   | `AnFtUchihaTrng00` | Uchiha           | Ancestry `system.items` |
| Sharingan Awakened     | `AnFtSharinganAwk` | Uchiha           | `HeriSharinganAwk`      |
| Hyūga Clan Training    | `AnFtHyugaTrng000` | Hyūga            | Ancestry `system.items` |
| Byakugan Ability       | `AnFtByakuganAble` | Hyūga            | `HeriByakuganBorn`      |
| Senju Clan Training    | `AnFtSenjuTrng000` | Senju            | Ancestry `system.items` |
| Mokuton Affinity       | `AnFtMokutonAffin` | Senju            | `HeriMokutonLatnt`      |
| Uzumaki Clan Training  | `AnFtUzumakiTrn00` | Uzumaki          | Ancestry `system.items` |
| Chakra Surplus         | `AnFtChakraSurpls` | Uzumaki          | `HeriSealmasterUz`      |
| Aburame Clan Training  | `AnFtAburameTrn00` | Aburame          | Ancestry `system.items` |
| Beetle Swarms          | `AnFtBeetleSwarms` | Aburame          | `HeriHiveBondedAb`      |
| Inuzuka Clan Training  | `AnFtInuzukaTrn00` | Inuzuka          | Ancestry `system.items` |
| Fang-Fang Fire         | `AnFtFangFangFire` | Inuzuka          | `HeriNinkenPartnr`      |
| Nara Clan Training     | `AnFtNaraTrng0000` | Nara             | Ancestry `system.items` |
| Shadow Mimicry         | `AnFtShadowMimcry` | Nara             | `HeriShadowImitat`      |
| Akimichi Clan Training | `AnFtAkimichiTrn0` | Akimichi         | Ancestry `system.items` |
| Calorie Fuel           | `AnFtCalorieFuel0` | Akimichi         | `HeriCalorieBurnr`      |
| Yamanaka Clan Training | `AnFtYamanakaTrn0` | Yamanaka         | Ancestry `system.items` |
| Mind Intruder          | `AnFtMindIntrudr0` | Yamanaka         | `HeriMindWalkerYa`      |
| Hōzuki Clan Training   | `AnFtHozukiTrng00` | Hōzuki           | Ancestry `system.items` |
| Water-Body Knock       | `AnFtWaterBodyKnk` | Hōzuki           | `HeriHydrifctnBrn`      |
| Academy Trained        | `AnFtAcademyTrnd0` | Civilian Shinobi | Ancestry `system.items` |

### Folder IDs

`packs/heritages/_folders.json`:

| Folder name      | `_id`              |
| ---------------- | ------------------ |
| Uchiha           | `FldrUchihaClan00` |
| Hyūga            | `FldrHyugaClan001` |
| Senju            | `FldrSenjuClan001` |
| Uzumaki          | `FldrUzumakiCln00` |
| Aburame          | `FldrAburameCln00` |
| Inuzuka          | `FldrInuzukaCln00` |
| Nara             | `FldrNaraClan0001` |
| Akimichi         | `FldrAkimichiCl00` |
| Yamanaka         | `FldrYamanakaCl00` |
| Hōzuki           | `FldrHozukiClan00` |
| Civilian Shinobi | `FldrCivilianShnb` |

`packs/ancestry-features/_folders.json`:

| Folder name      | `_id`              |
| ---------------- | ------------------ |
| Uchiha           | `FldAUchihaClan00` |
| Hyūga            | `FldAHyugaClan001` |
| Senju            | `FldASenjuClan001` |
| Uzumaki          | `FldAUzumakiCln00` |
| Aburame          | `FldAAburameCln00` |
| Inuzuka          | `FldAInuzukaCln00` |
| Nara             | `FldANaraClan0001` |
| Akimichi         | `FldAAkimichiCl00` |
| Yamanaka         | `FldAYamanakaCl00` |
| Hōzuki           | `FldAHozukiClan00` |
| Civilian Shinobi | `FldACivilianShnb` |

## Milestone 3: Specializations, Chakra Core, Class Actions

### Chakra model (canonical reference)

- **Spell slots** = chakra capacity at any one moment. Set by each
  Specialization's `system.spellcasting` rank and spell-slot progression.
- **Focus Points** = renewable pool fuel for Charge Chakra (10-minute
  Refocus).
- **Charge Chakra** (focus spell, `SpllChargChakra0`) = variable cast
  `◇` to `◇◇◇` for 1 Focus Point; restores N expended spell slots where
  N is the action cost.
- **Chakra Reserves** (`ClFtChakraReser0`) = daily-use counter for Charge
  Chakra. Starts at 1; clan heritages, ancestry feats, and class
  features bump it.
- **`chakra` magic tradition** = registered at `init` by
  `src/register-traits.ts` so trait pickers everywhere render the label.

### Classes (`packs/classes`)

| Specialization      | `_id`              | Key        | HP  | Spellcasting | Saves (F/R/W) |
| ------------------- | ------------------ | ---------- | --- | ------------ | ------------- |
| Ninjutsu Specialist | `ClssNinjutsuSpc0` | INT        | 6   | 1 (full)     | 1/2/2         |
| Genjutsu Specialist | `ClssGenjutsuSpc0` | CHA        | 6   | 1 (full)     | 1/1/2         |
| Taijutsu Specialist | `ClssTaijutsuSpc0` | STR        | 10  | 0 (martial)  | 2/2/1         |
| Medical-nin         | `ClssMedicalNin00` | WIS        | 8   | 1 (full)     | 2/1/2         |
| Sensor              | `ClssSensorClass0` | WIS        | 8   | 1 (half)     | 1/2/2         |
| Anbu Operative      | `ClssAnbuOprtve00` | DEX        | 8   | 1 (half)     | 2/2/1         |
| Weapon Master       | `ClssWeaponMastr0` | STR or DEX | 10  | 0 (martial)  | 2/2/1         |
| Summoner            | `ClssSummonerCl00` | CHA        | 8   | 1 (full)     | 1/1/2         |

Each class auto-grants (via `system.items`) the shared chakra-core
features (Chakra Casting if caster, Chakra Reserves, Charge Chakra),
its own Specialization feature, and its Path picker.

### Class features (`packs/class-features`)

**Shared (5):**

| Name                 | `_id`              | Granted at level                 |
| -------------------- | ------------------ | -------------------------------- |
| Chakra Casting       | `ClFtChakraCastr0` | 1 (casters only)                 |
| Chakra Reserves      | `ClFtChakraReser0` | 1 (all classes)                  |
| Charge Chakra        | `ClFtChargeChakr0` | 1 (all classes; grants rank 1)   |
| Expert Chakra Caster | `ClFtExprtChakra0` | 7 (casters only; grants rank 2)  |
| Master Chakra Caster | `ClFtMastrChakra0` | 15 (casters only; grants rank 3) |

**Per-class baseline + picker (16):**

| Class               | Specialization feature `_id` | Path picker `_id`  |
| ------------------- | ---------------------------- | ------------------ |
| Ninjutsu Specialist | `ClFtNinjutsuSpc0`           | `ClFtNinjutsuPth0` |
| Genjutsu Specialist | `ClFtGenjutsuSpc0`           | `ClFtGenjutsuPth0` |
| Taijutsu Specialist | `ClFtTaijutsuSpc0`           | `ClFtTaijutsuPth0` |
| Medical-nin         | `ClFtMedicalSpc00`           | `ClFtMedicalPth00` |
| Sensor              | `ClFtSensorSpc000`           | `ClFtSensorPth000` |
| Anbu Operative      | `ClFtAnbuSpc00000`           | `ClFtAnbuPth00000` |
| Weapon Master       | `ClFtWeaponMSpc00`           | `ClFtWeaponMPth00` |
| Summoner            | `ClFtSummonerSpc0`           | `ClFtSummonerPth0` |

**Subclass options (24):**

| Class          | Options                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| Ninjutsu       | Fire (`ClFtPathFire0000`), Wind (`ClFtPathWind0000`), Lightning (`ClFtPathLghtnng0`)                      |
| Genjutsu       | Sensory (`ClFtSchoolSensry`), Telepathic (`ClFtSchoolTeleph`), Spatial (`ClFtSchoolSpatil`)               |
| Taijutsu       | Gentle Fist (`ClFtStyleGntlFst`), Strong Fist (`ClFtStyleStrgFst`), Drunken Fist (`ClFtStyleDrunken`)     |
| Medical-nin    | Field Medic (`ClFtDiscFieldMed`), Surgeon (`ClFtDiscSurgeon0`), Battle Medic (`ClFtDiscBtlMedic`)         |
| Sensor         | Chakra Sensing (`ClFtMthdChakraSn`), Tracker (`ClFtMthdTracker0`), Barrier Detection (`ClFtMthdBarrier0`) |
| Anbu Operative | Assassination (`ClFtDivAssassin0`), Interrogation (`ClFtDivIntrgtor0`), Hunter-nin (`ClFtDivHuntrnin0`)   |
| Weapon Master  | Kenjutsu (`ClFtDscKenjutsu0`), Bukijutsu (`ClFtDscBukijutsu`), Bowyer (`ClFtDscBowyer000`)                |
| Summoner       | Toad (`ClFtCntctToad000`), Snake (`ClFtCntctSnake00`), Slug (`ClFtCntctSlug000`)                          |

### Class actions (`packs/class-actions`)

**Shared (2):**

| Name                    | `_id`              |
| ----------------------- | ------------------ |
| Body Flicker (Shunshin) | `ClAcBodyFlicker0` |
| Substitution (Kawarimi) | `ClAcSubstition00` |

**Per-class signature (8):**

| Action                 | `_id`              | Class               | Granted by         |
| ---------------------- | ------------------ | ------------------- | ------------------ |
| Five Elemental Seal    | `ClAcFiveElement0` | Ninjutsu Specialist | `ClFtNinjutsuSpc0` |
| Genjutsu Release       | `ClAcGenjutsuRels` | Genjutsu Specialist | `ClFtGenjutsuSpc0` |
| Gentle Pressure Strike | `ClAcGentleStrk00` | Taijutsu Specialist | `ClFtTaijutsuSpc0` |
| Healing Palm           | `ClAcHealingPalm0` | Medical-nin         | `ClFtMedicalSpc00` |
| Sense Chakra           | `ClAcSenseChakra0` | Sensor              | `ClFtSensorSpc000` |
| Silent Strike          | `ClAcSilntStrike0` | Anbu Operative      | `ClFtAnbuSpc00000` |
| Iaijutsu Draw          | `ClAcWpnDraw00000` | Weapon Master       | `ClFtWeaponMSpc00` |
| Quick Kuchiyose        | `ClAcSummonAlly00` | Summoner            | `ClFtSummonerSpc0` |

### Spells (`packs/spells`)

| Name                    | `_id`              | Rank | Output ceiling | Tradition |
| ----------------------- | ------------------ | ---- | -------------- | --------- |
| Charge Chakra           | `SpllChargChakra0` | 1    | up to 3 slots  | chakra    |
| Charge Chakra (Greater) | `SpllChrgChak2nd0` | 2    | up to 6 slots  | chakra    |
| Charge Chakra (Master)  | `SpllChrgChak3rd0` | 3    | up to 9 slots  | chakra    |

All three variants share the Focus Point pool **and** the Chakra
Reserves daily counter. Output per cast is `rank × actions_spent`, so
the rank-3 / 3-action peak hits the 9-slot ceiling envisioned for
Sage-tier shinobi.

## Milestone 3.5: Spell-rank progression & class flags

### Class flags (read by `src/auto-spellcasting.ts`)

Each class JSON declares two `flags.pf2e-shinobi` keys that the runtime
helper reads when it provisions Chakra Spellcasting Entries on a new
character:

| Class               | `spellcastingProgression` | `chakraKeyAbility` |
| ------------------- | ------------------------- | ------------------ |
| Ninjutsu Specialist | `full`                    | `int`              |
| Genjutsu Specialist | `full`                    | `cha`              |
| Taijutsu Specialist | `none`                    | `str`              |
| Medical-nin         | `full`                    | `wis`              |
| Sensor              | `half`                    | `wis`              |
| Anbu Operative      | `half`                    | `dex`              |
| Weapon Master       | `none`                    | `str`              |
| Summoner            | `full`                    | `cha`              |

`progression: "full"` and `"half"` get both a focus and a slot entry
on character creation; `"none"` gets only the focus entry (for Charge
Chakra). All slot maxes start at 0 — the player or PF2e Leveler still
decides slot counts; the helper just makes sure the entry exists with
the right tradition and key ability so jutsu auto-route there.

Anbu's `keyAbility.value` is `["dex", "cha"]`, which causes the PF2e
character builder to prompt the player to choose at creation time.

## Milestone 4: Jutsu (spells) and spell-effects

### Spells pack folder layout

| Folder                    | `_id`              | Count | Contents                                                                         |
| ------------------------- | ------------------ | ----- | -------------------------------------------------------------------------------- |
| Academy Cantrips          | `FldSAcademyCntrp` | 5     | Henge, Bunshin, Kawarimi (cantrip variant), Throwing, Tree-Walking               |
| Ninjutsu                  | `FldSNinjutsuJtsu` | 37    | 25 elemental (5 each Fire/Wind/Lightning/Water/Earth) + 12 general               |
| Genjutsu                  | `FldSGenjutsuJtsu` | 10    | Hotarubi → Tsukuyomi → Kotoamatsukami (rank 1 → 10)                              |
| Medical Jutsu             | `FldSMedicalJtsu0` | 8     | Mystic Palm → Creation Rebirth (rank 1 → 8)                                      |
| Summoning Jutsu           | `FldSSummoningJts` | 6     | Toad, Snake, Slug, Crow, Boss Summon, Edo Tensei                                 |
| Fūinjutsu                 | `FldSFuinjutsuJts` | 6     | Storage, Bunsetsu Bunshin, Contract, 5 Elements, 4 Symbols, Reaper               |
| Special / Kekkei Genkai   | `FldSSpecialKkgnk` | 7     | Sharingan Copy, 64 Palms, Mokuton Lock, Hydrification, Sage, Hiraishin, Bijudama |
| Focus / Chakra Management | `FldSFocusChakra0` | 3     | Charge Chakra (ranks 1, 2, 3 — Lesser / Greater / Master)                        |

Total: **82 spells** (79 new in M4 + 3 Charge Chakra variants moved into the
Focus folder). Spell ranks span 1 through 10.

### Iconic / restricted jutsu register

These are the milestone-4 spells gated by `rare` or `unique` rarity. The
rare/unique tag plus a `requirements` clause is the primary access-control
mechanism; GMs are expected to gate them further with feat chains in
later milestones.

| Spell                        | Rank | Rarity | Gate                                                               |
| ---------------------------- | ---- | ------ | ------------------------------------------------------------------ |
| Amaterasu                    | 9    | rare   | Mangekyō Sharingan (Uchiha clan-feat chain, future milestone)      |
| Tsukuyomi                    | 9    | rare   | Mangekyō Sharingan; target can see your eyes                       |
| Kotoamatsukami               | 10   | unique | Shisui's lineage Mangekyō; cannot have been cast in the last 10 yr |
| Bijudama (Tailed Beast Bomb) | 10   | unique | Jinchūriki of a tailed beast                                       |
| Hiraishin no Jutsu           | 9    | unique | Active Hiraishin marker; mastery of the Yondaime's seal            |
| Reaper Death Seal            | 9    | unique | The caster dies after resolution. Always.                          |
| Kuchiyose: Edo Tensei        | 10   | unique | DNA of the deceased + a vessel humanoid (consumed)                 |
| Kirin                        | 8    | rare   | A natural storm overhead (or a freshly-cast fire jutsu as proxy)   |
| Bringer-of-Darkness          | 5    | rare   | None mechanical; flagged rare for tonal weight                     |
| Tajuu Kage Bunshin           | 5    | rare   | Author the appropriate chakra reserves; fatigue after dispersion   |

### Spell-effects pack folder layout

| Folder               | `_id`              | Count | Contents                                                                         |
| -------------------- | ------------------ | ----- | -------------------------------------------------------------------------------- |
| Ninjutsu Effects     | `FldENinjutsuEffc` | 2     | Shadow Bound (Kagemane), Mind-Switched (Shintenshin vessel)                      |
| Genjutsu Effects     | `FldEGenjutsuEffc` | 3     | Genjutsu Bound, Hell Viewing, False Surroundings                                 |
| Medical Effects      | `FldEMedicalEffct` | 2     | Cell Activation, Hundred Seal                                                    |
| Special / KG Effects | `FldESpecialEffct` | 5     | Hydrified, Sharingan Active, Sage Mode, Amaterasu Black Flames, Hiraishin Marker |

Each effect's description includes a `@UUID[...]` link back to its
originating spell so the chat card or sheet rollup remains discoverable.

### Notes on chakra tradition coverage

- Every spell in the pack carries the `chakra` tradition. Players
  configuring their actor's Spellcasting Entry (auto-provisioned by
  `src/auto-spellcasting.ts` for our classes) must set the entry's
  tradition to `chakra` for jutsu to auto-route there.
- Elemental jutsu use PF2e's stock element traits (`fire`, `air`,
  `electricity`, `water`, `earth`) so PF2e's resistances, weaknesses,
  and rule elements work without modification.
- Clan-locked jutsu carry the corresponding clan trait (`uchiha`,
  `hyuga`, `senju`, `hozuki`, `uzumaki`, `nara`, `yamanaka`,
  `akimichi`) in addition to school traits so the trait selector keeps
  them filterable.

### Schema additions

`scripts/schemas/by-type/effect.ts` mirrors the upstream PF2e effect
shape and is wired into `schemasByType`. Notable difference from other
typed schemas: `system.traits.rarity` is **optional** for effects to
match upstream behavior (most upstream effects ship without a rarity).
