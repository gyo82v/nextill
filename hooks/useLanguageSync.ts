"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useLanguageSync(profile) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!profile) {
      const stored = localStorage.getItem("language") || "en";
      i18n.changeLanguage(stored);
      return;
    }

    const lang = profile.nextillApp.settings.language;
    if (lang) i18n.changeLanguage(lang);
  }, [profile, i18n]);
}