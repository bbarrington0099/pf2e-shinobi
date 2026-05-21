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
| `Fldr` | Folder in `heritages/`          |
| `FldA` | Folder in `ancestry-features/`  |

Future milestones will add `Back` (background), `Clss` (class), `ClFt`
(class feature), `Feat` (general feat), `Spll` (spell), `Equp`
(equipment), `Effc` (effect), `Deit` (deity), and similar prefixes.

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
