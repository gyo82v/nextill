import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";

let initialized = false;

if (!initialized) {
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    lng: "en",
  });

  initialized = true;
}

export default i18n;