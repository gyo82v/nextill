"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "@/firebase/authProvider";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";

const navItems = [
  { href: "/till", label: "Till" },
  { href: "/menu", label: "Menu" },
  { href: "/stock", label: "Stock" },
  { href: "/statistics", label: "Stats" },
  { href: "/account", label: "Account" },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut, loading } = useAuth();

  const displayName = useMemo(() => {
    return profile?.displayName?.trim() || "User";
  }, [profile]);

  async function handleSignOut() {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  return (
    <header className="border-b-2 border-neutral-600 ">
      <div className=" mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-2xl" >
            Nextill
          </h1>
          <ThemeToggle />
          <LanguageToggle />

          <nav className="items-center gap-2 md:flex ">
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

        <div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loading}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-red-500 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {displayName}
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}