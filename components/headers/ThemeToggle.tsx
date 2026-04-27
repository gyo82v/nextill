"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { updateDarkMode } from "@/firebase/userSettings";
import { FiSun, FiMoon } from "react-icons/fi";
import { modalPanel, iconsBtn } from "@/styles";
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
      className={`group ${iconsBtn}
                  hover:-translate-y-0.5 hover:shadow-md
                  dark:hover:shadow-black/20`}
    >
      <span>
        {isDark ? (
          <FiSun
            aria-hidden="true"
            className={`h-5 w-5 ${modalPanel} group-hover:scale-110`}
        />
        ) : (
          <FiMoon
            aria-hidden="true"
            className={`h-5 w-5 ${modalPanel} group-hover:scale-110`}
        />
        )}
      </span>
    </button>
  );
}

