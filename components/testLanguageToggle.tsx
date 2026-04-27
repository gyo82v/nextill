"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/firebase/authProvider";
import { updateLanguage } from "@/firebase/userSettings";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/i18n/languages";

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
      await updateLanguage({ uid: user.uid, nextLang: nextLanguage });
    }
  }

  if (!hydrated) return null;

  return (
    <label className="relative inline-flex h-11 min-w-[11rem] items-center rounded-xl border border-default bg-surface-2 px-4 pr-10 shadow-sm transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out hover-surface-1 motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:transform-none">
      <span className="sr-only">Select language</span>

      <select
        value={currentLanguage}
        onChange={handleChange}
        aria-label="Language"
        className="h-full w-full cursor-pointer appearance-none bg-transparent py-0 pr-8 text-sm font-medium text-foreground outline-none"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>

      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute right-3 h-4 w-4 text-muted"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </label>
  );
}

/*


"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/firebase/authProvider";
import { updateLanguage } from "@/firebase/userSettings";
import {SUPPORTED_LANGUAGES, type LanguageCode,} from "@/i18n/languages";

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






*/