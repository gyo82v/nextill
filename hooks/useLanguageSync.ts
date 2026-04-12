"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { UserProfile } from "@/firebase/authClient";

const FALLBACK_LANGUAGE = "en";

export function useLanguageSync(profile: UserProfile | null) {
  const { i18n } = useTranslation();
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent running twice (StrictMode / re-renders)
    if (initializedRef.current) return;
    initializedRef.current = true;

    // 1️⃣ User NOT logged in → localStorage
    if (!profile) {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("language")
          : null;

      const lang = stored || FALLBACK_LANGUAGE;
      i18n.changeLanguage(lang);
      return;
    }

    // 2️⃣ User logged in → Firestore
    const lang =
      profile.nextillApp?.settings?.language || FALLBACK_LANGUAGE;

    i18n.changeLanguage(lang);

    // Keep localStorage in sync
    localStorage.setItem("language", lang);
  }, [profile, i18n]);
}