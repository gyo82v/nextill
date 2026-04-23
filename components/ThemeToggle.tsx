"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { updateDarkMode } from "@/firebase/userSettings";
import { FiSun, FiMoon } from "react-icons/fi";
import { focusRing, modalPanel, transitions, activePress } from "@/styles";
import { useTranslation } from "react-i18next";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  async function toggle() {
    const next = !isDark;

    setTheme(next ? "dark" : "light");

    if (user) {
      await updateDarkMode({ uid: user.uid, darkmode: next });
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={t(isDark ? "theme.switchToLight" : "theme.switchToDark")}
      title={t(isDark ? "theme.switchToLight" : "theme.switchToDark")}
      className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl
                  bg-surface-2 text-muted border border-default shadow-sm
                  ${transitions} ${activePress} ${focusRing}
                  hover:-translate-y-0.5 hover:shadow-md hover:bg-surface-1
                  dark:hover:shadow-black/20`}
    >
      <span className="relative h-5 w-5">
        <FiSun
          aria-hidden="true"
          className={`
            absolute inset-0 h-5 w-5
            ${modalPanel}
            group-hover:scale-110 
            ${isDark ? "scale-100 rotate-0 opacity-100": "scale-75 -rotate-90 opacity-0"}
          `}
        />
        <FiMoon
          aria-hidden="true"
          className={`
            absolute inset-0 h-5 w-5
            ${modalPanel}
            group-hover:scale-110 
            ${isDark ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}
          `}
        />
      </span>
    </button>
  );
}

