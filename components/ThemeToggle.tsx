"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Avoid rendering until theme is resolved
  if (!resolvedTheme) return null;

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      className="px-3 py-1 rounded border"
      suppressHydrationWarning
    >
      {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}