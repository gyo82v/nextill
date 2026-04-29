import enCommon from "./locales/en/common.json";
import itCommon from "./locales/it/common.json";
import esCommon from "./locales/es/common.json";
import frCommon from "./locales/fr/common.json";
import deCommon from "./locales/de/common.json";
import enPrivacy from "./locales/en/privacy.json";
import itPrivacy from "./locales/it/privacy.json";
import frPrivacy from "./locales/fr/privacy.json";
import dePrivacy from "./locales/de/privacy.json";
import esPrivacy from "./locales/es/privacy.json";


export const resources = {
  en: {
    common: enCommon,
    privacy: enPrivacy,
  },
  it: {
    common: itCommon,
    privacy: itPrivacy,
  },
  es: {
    common: esCommon,
    privacy: esPrivacy,
  },
  fr: {
    common: frCommon,
    privacy: frPrivacy,
  },
  de: {
    common: deCommon,
    privacy: dePrivacy,
  },
} as const;