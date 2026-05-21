import { MODULE_ID } from "./constants.js";
import { logger } from "./logger.js";

/**
 * Custom traits the module ships under `pf2e-shinobi`.
 *
 * Each entry is `[traitKey, localizationKey]`. The localization key resolves
 * against `lang/<locale>.json` so the trait shows a readable label in spell,
 * item, and feat trait selectors (rather than the raw key).
 *
 * Naruto-flavored mechanical traits live here; ancestry name traits (uchiha,
 * hyuga, ...) are registered separately in CLAN_TRAITS so they only attach to
 * the appropriate collections.
 */
const CHAKRA_TRAITS: Record<string, string> = {
  chakra: `${MODULE_ID}.traits.chakra`,
  ninjutsu: `${MODULE_ID}.traits.ninjutsu`,
  genjutsu: `${MODULE_ID}.traits.genjutsu`,
  taijutsu: `${MODULE_ID}.traits.taijutsu`,
  dojutsu: `${MODULE_ID}.traits.dojutsu`,
  fuinjutsu: `${MODULE_ID}.traits.fuinjutsu`,
  "kekkei-genkai": `${MODULE_ID}.traits.kekkei-genkai`,
  kuchiyose: `${MODULE_ID}.traits.kuchiyose`,
  "shinobi-tool": `${MODULE_ID}.traits.shinobi-tool`,
};

const CLAN_TRAITS: Record<string, string> = {
  uchiha: `${MODULE_ID}.traits.uchiha`,
  hyuga: `${MODULE_ID}.traits.hyuga`,
  senju: `${MODULE_ID}.traits.senju`,
  uzumaki: `${MODULE_ID}.traits.uzumaki`,
  aburame: `${MODULE_ID}.traits.aburame`,
  inuzuka: `${MODULE_ID}.traits.inuzuka`,
  nara: `${MODULE_ID}.traits.nara`,
  akimichi: `${MODULE_ID}.traits.akimichi`,
  yamanaka: `${MODULE_ID}.traits.yamanaka`,
  hozuki: `${MODULE_ID}.traits.hozuki`,
  "civilian-shinobi": `${MODULE_ID}.traits.civilian-shinobi`,
  ninja: `${MODULE_ID}.traits.ninja`,
  shadow: `${MODULE_ID}.traits.shadow`,
  wood: `${MODULE_ID}.traits.wood`,
  water: `${MODULE_ID}.traits.water`,
};

const SPECIALIZATION_TRAITS: Record<string, string> = {
  "ninjutsu-specialist": `${MODULE_ID}.traits.ninjutsu-specialist`,
  "genjutsu-specialist": `${MODULE_ID}.traits.genjutsu-specialist`,
  "taijutsu-specialist": `${MODULE_ID}.traits.taijutsu-specialist`,
  "medical-nin": `${MODULE_ID}.traits.medical-nin`,
  sensor: `${MODULE_ID}.traits.sensor`,
  "anbu-operative": `${MODULE_ID}.traits.anbu-operative`,
  "weapon-master": `${MODULE_ID}.traits.weapon-master`,
  summoner: `${MODULE_ID}.traits.summoner`,
};

interface PF2EConfig extends AnyObject {
  magicTraditions?: Record<string, string>;
  spellTraits?: Record<string, string>;
  ancestryTraits?: Record<string, string>;
  classTraits?: Record<string, string>;
  featTraits?: Record<string, string>;
  actionTraits?: Record<string, string>;
  effectTraits?: Record<string, string>;
  equipmentTraits?: Record<string, string>;
}

function extend(
  target: Record<string, string> | undefined,
  source: Record<string, string>,
  label: string,
): void {
  if (!target) {
    logger.warn(`PF2E config collection "${label}" not found; skipping trait registration.`);
    return;
  }
  for (const [key, value] of Object.entries(source)) {
    if (key in target) continue;
    target[key] = value;
  }
}

/**
 * Extend the PF2e system's trait collections at `init` so that our custom
 * trait keys render with friendly labels everywhere a trait picker is shown.
 *
 * Notes:
 *   - PF2e snapshots `magicTraditions` into `spellTraits`, `effectTraits`,
 *     etc. at module load. We have to extend each runtime collection
 *     individually.
 *   - We do not delete or overwrite existing PF2e keys; the merge is
 *     idempotent.
 */
export function registerCustomTraits(): void {
  const pf2eConfig = (CONFIG as { PF2E?: PF2EConfig }).PF2E;
  if (!pf2eConfig) {
    logger.warn("CONFIG.PF2E missing at init; trait registration skipped.");
    return;
  }

  extend(pf2eConfig.magicTraditions, { chakra: CHAKRA_TRAITS.chakra! }, "magicTraditions");

  extend(pf2eConfig.spellTraits, CHAKRA_TRAITS, "spellTraits");
  extend(pf2eConfig.spellTraits, CLAN_TRAITS, "spellTraits");

  extend(pf2eConfig.ancestryTraits, CLAN_TRAITS, "ancestryTraits");
  extend(pf2eConfig.classTraits, SPECIALIZATION_TRAITS, "classTraits");

  extend(pf2eConfig.featTraits, CHAKRA_TRAITS, "featTraits");
  extend(pf2eConfig.featTraits, CLAN_TRAITS, "featTraits");
  extend(pf2eConfig.featTraits, SPECIALIZATION_TRAITS, "featTraits");

  extend(pf2eConfig.actionTraits, CHAKRA_TRAITS, "actionTraits");
  extend(pf2eConfig.actionTraits, CLAN_TRAITS, "actionTraits");
  extend(pf2eConfig.actionTraits, SPECIALIZATION_TRAITS, "actionTraits");

  extend(pf2eConfig.effectTraits, CHAKRA_TRAITS, "effectTraits");
  extend(pf2eConfig.effectTraits, CLAN_TRAITS, "effectTraits");

  extend(pf2eConfig.equipmentTraits, CHAKRA_TRAITS, "equipmentTraits");

  logger.info(
    `Registered ${Object.keys(CHAKRA_TRAITS).length + Object.keys(CLAN_TRAITS).length + Object.keys(SPECIALIZATION_TRAITS).length} custom traits across PF2e config collections.`,
  );
}
