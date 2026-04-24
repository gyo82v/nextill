"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/headers/ThemeToggle";
import UserSection from "@/components/headers/UserSection";

const navItems = [
  { href: "/till", label: "Till" },
  { href: "/menu", label: "Menu" },
  { href: "/stock", label: "Stock" },
  { href: "/statistics", label: "Stats" },
  { href: "/account", label: "Account" },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-neutral-600  ">
      <div className=" mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-2xl" >
            Nextill
          </h1>
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
        <div className="flex gap-5">
          <ThemeToggle />
          <UserSection />
        </div>
      </div>
    </header>
  );
}