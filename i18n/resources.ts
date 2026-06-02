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
import enMenu from "./locales/en/menu.json";
import itMenu from "./locales/it/menu.json";
import esMenu from "./locales/es/menu.json";
import frMenu from "./locales/fr/menu.json";
import deMenu from "./locales/de/menu.json";
import enStock from "./locales/en/stock.json";
import itStock from "./locales/it/stock.json";
import esStock from "./locales/es/stock.json";
import frStock from "./locales/fr/stock.json";
import deStock from "./locales/de/stock.json";
import enReports from "./locales/en/reports.json"
import itReports from "./locales/it/reports.json"
import esReports from "./locales/es/reports.json"
import frReports from "./locales/fr/reports.json"
import deReports from "./locales/de/reports.json"
import enPos from "./locales/en/pos.json"
import itPos from "./locales/it/pos.json"
import esPos from "./locales/es/pos.json"
import frPos from "./locales/fr/pos.json"
import dePos from "./locales/de/pos.json"


export const resources = {
  en: {
    common: enCommon,
    privacy: enPrivacy,
    auth: enAuth,
    menu: enMenu,
    stock: enStock,
    reports: enReports,
    pos: enPos
  },
  it: {
    common: itCommon,
    privacy: itPrivacy,
    auth: itAuth,
    menu: itMenu,
    stock: itStock,
    reports: itReports,
    pos: itPos
  },
  es: {
    common: esCommon,
    privacy: esPrivacy,
    auth: esAuth,
    menu: esMenu,
    stock: esStock,
    reports: esReports,
    pos: esPos
  },
  fr: {
    common: frCommon,
    privacy: frPrivacy,
    auth: frAuth,
    menu: frMenu,
    stock: frStock,
    reports: frReports,
    pos: frPos
  },
  de: {
    common: deCommon,
    privacy: dePrivacy,
    auth: deAuth,
    menu: deMenu,
    stock: deStock,
    reports: deReports,
    pos: dePos
  },
} as const;