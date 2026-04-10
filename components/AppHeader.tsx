"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "@/firebase/authProvider";

type AppHeaderProps = {
  onToggleTheme?: () => void;
  themeLabel?: string;
  onToggleLanguage?: () => void;
  languageLabel?: string;
};

const navItems = [
  { href: "/till", label: "Till" },
  { href: "/menu", label: "Menu" },
  { href: "/stock", label: "Stock" },
  { href: "/statistics", label: "Stats" },
  { href: "/account", label: "Account" },
];

export default function AppHeader({
  onToggleTheme,
  themeLabel = "Theme",
  onToggleLanguage,
  languageLabel = "Language",
}: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut, loading } = useAuth();

  const displayName = useMemo(() => {
    return profile?.displayName?.trim() || "User";
  }, [profile]);

  async function handleSignOut() {
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/till" className="text-lg font-semibold tracking-tight">
            Nextill
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-lg px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {onToggleLanguage ? (
            <button
              type="button"
              onClick={onToggleLanguage}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              {languageLabel}
            </button>
          ) : null}

          {onToggleTheme ? (
            <button
              type="button"
              onClick={onToggleTheme}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              {themeLabel}
            </button>
          ) : null}

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Logged in
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={loading}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Sign out
          </button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "whitespace-nowrap rounded-lg px-3 py-2 text-sm transition",
                isActive
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}