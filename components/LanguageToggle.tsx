"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/firebase/authProvider";
import { updateLanguage } from "@/firebase/userSettings";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isIt = i18n.language === "it";

  async function toggle() {
    const next = isIt ? "en" : "it";

    i18n.changeLanguage(next);
    localStorage.setItem("language", next);

    if (user) {
      await updateLanguage(user.uid, next);
    }
  }

  return (
    <button onClick={toggle} className="px-3 py-1 border rounded">
      {isIt ? "IT" : "EN"}
    </button>
  );
}