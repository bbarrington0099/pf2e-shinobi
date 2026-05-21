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
| `Fldr` | Folder in `heritages/`          |
| `FldA` | Folder in `ancestry-features/`  |
| `FldC` | Folder in `class-features/`     |
| `FldX` | Folder in `class-actions/`      |

Future milestones will add `Back` (background), `Feat` (general feat),
`Equp` (equipment), `Effc` (effect), `Deit` (deity), and similar prefixes.

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

**Shared (3):**

| Name            | `_id`              |
| --------------- | ------------------ |
| Chakra Casting  | `ClFtChakraCastr0` |
| Chakra Reserves | `ClFtChakraReser0` |
| Charge Chakra   | `ClFtChargeChakr0` |

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

| Name          | `_id`              | Type        | Tradition |
| ------------- | ------------------ | ----------- | --------- |
| Charge Chakra | `SpllChargChakra0` | focus spell | chakra    |
