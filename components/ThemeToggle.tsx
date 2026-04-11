"use client";

import { useTheme } from "next-themes";
import { updateDarkMode } from "@/firebase/userSettings";
import { useAuth } from "@/firebase/authProvider";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useAuth();

  if (!resolvedTheme) return null;

  const isDark = resolvedTheme === "dark";

  async function toggleTheme() {
    const nextIsDark = !isDark;

    // 1. Always update UI
    setTheme(nextIsDark ? "dark" : "light");

    // 2. Persist ONLY if logged in
    if (!user) return;

    try {
      await updateDarkMode(user.uid, nextIsDark);
    } catch (err) {
      console.error("Failed to save theme preference", err);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="px-3 py-1 rounded border"
      suppressHydrationWarning
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}