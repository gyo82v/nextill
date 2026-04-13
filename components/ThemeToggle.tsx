"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { updateDarkMode } from "@/firebase/userSettings";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  async function toggle() {
    const next = !isDark;

    setTheme(next ? "dark" : "light");

    if (user) {
      await updateDarkMode({uid: user.uid, darkmode: next});
    }
  }

  return (
    <button onClick={toggle} className="px-3 py-1 border rounded">
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}