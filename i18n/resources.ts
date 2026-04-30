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
import enAuth from "./locales/en/auth.json";
import itAuth from "./locales/it/auth.json";
import esAuth from "./locales/es/auth.json";
import frAuth from "./locales/fr/auth.json";
import deAuth from "./locales/de/auth.json";


export const resources = {
  en: {
    common: enCommon,
    privacy: enPrivacy,
    auth: enAuth,
  },
  it: {
    common: itCommon,
    privacy: itPrivacy,
    auth: itAuth,
  },
  es: {
    common: esCommon,
    privacy: esPrivacy,
    auth: esAuth,
  },
  fr: {
    common: frCommon,
    privacy: frPrivacy,
    auth: frAuth,
  },
  de: {
    common: deCommon,
    privacy: dePrivacy,
    auth: deAuth,
  },
} as const;