"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/firebase/authProvider";
import { updateLanguage } from "@/firebase/userSettings";
import {
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from "@/i18n/languages";

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return hydrated;
}

export default function LanguageToggle() {
  const hydrated = useHydrated();
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "en") as LanguageCode;

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLanguage = e.target.value as LanguageCode;

    await i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);

    if (user) {
      await updateLanguage({uid: user.uid, nextLang: nextLanguage});
    }
  }

  if (!hydrated) return null;

  return (
    <label className="inline-flex items-center gap-2 rounded border px-3 py-1">
      <span className="sr-only">Language</span>
      <select
        value={currentLanguage}
        onChange={handleChange}
        className="bg-transparent outline-none"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </label>
  );
}