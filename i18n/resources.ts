import enCommon from "./locales/en/common.json";
import itCommon from "./locales/it/common.json";
import esCommon from "./locales/es/common.json";
import frCommon from "./locales/fr/common.json";
import deCommon from "./locales/de/common.json";

export const resources = {
  en: {
    common: enCommon,
  },
  it: {
    common: itCommon,
  },
  es: {
    common: esCommon,
  },
  fr: {
    common: frCommon,
  },
  de: {
    common: deCommon,
  },
} as const;