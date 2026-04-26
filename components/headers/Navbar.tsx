"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { focusRing, transitions } from "@/styles";
import { navItems } from "@/components/headers/navItems";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const containerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const index = navItems.findIndex(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`)
    );

    const el = itemRefs.current[index];
    if (!el) return;

    setIndicator({
      left: el.offsetLeft,
      width: el.offsetWidth,
    });
  }, [pathname]); // ✅ correct dependency

  return (
    <nav aria-label="Primary" className="hidden md:flex">
      <ul
        ref={containerRef}
        className="relative flex items-center lg:gap-5 xl:gap-10 rounded-xl bg-surface-1 p-2 xl:px-4"
      >
        {/* Sliding indicator */}
        <span
          aria-hidden
          className="absolute inset-y-1 left-0 rounded-lg bg-[var(--surface-2)]
                     transition-[transform,width] duration-300 ease-out"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
          }}
        />

        {navItems.map((item, i) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li
              key={item.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="relative z-10"
            >
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "relative inline-flex items-center px-4 py-2 text-sm font-medium",
                  transitions,
                  focusRing,
                  "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                  "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[2px]",
                  "after:bg-[var(--primary)] after:origin-left after:scale-x-0",
                  "after:transition-transform after:duration-300 after:ease-out",
                  "hover:after:scale-x-100",
                  isActive ? "text-[var(--primary)] after:scale-x-100" : "",
                ].join(" ")}
              >
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}



/*
default navbar

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { focusRing, transitions } from "@/styles";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: "/till", label: t("nav.pos") },
    { href: "/menu", label: t("nav.menu") },
    { href: "/stock", label: t("nav.stock") },
    { href: "/statistics", label: t("nav.reports") },
    { href: "/account", label: t("nav.account") },
  ];

  return (
    <nav aria-label="Primary" className="hidden md:flex">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "relative inline-flex items-center px-4 py-2 text-sm font-medium",
                  transitions,
                  focusRing,

                  // base color
                  "text-[var(--muted-foreground)]",

                  // hover text color (like your old hover:text-accent)
                  "hover:text-[var(--primary)]",

                  // underline animation base (like your old after: setup)
                  "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full",
                  "after:bg-[var(--primary)]",
                  "after:origin-left after:scale-x-0",
                  "after:transition-transform after:duration-300 after:ease-in-out",

                  // hover underline
                  "hover:after:scale-x-100",

                  // active state (persistent underline + color + weight)
                  isActive
                    ? "text-[var(--primary)] font-medium after:scale-x-100"
                    : "",

                  // motion accessibility
                  "motion-reduce:transition-none motion-reduce:after:transition-none",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// glowing navbar

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { focusRing, transitions } from "@/styles";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: "/till", label: t("nav.pos") },
    { href: "/menu", label: t("nav.menu") },
    { href: "/stock", label: t("nav.stock") },
    { href: "/statistics", label: t("nav.reports") },
    { href: "/account", label: t("nav.account") },
  ];

  return (
    <nav aria-label="Primary" className="hidden md:flex">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "relative isolate inline-flex items-center px-4 py-2 text-sm font-medium",
                  transitions,
                  focusRing,
                  "text-[var(--muted-foreground)] hover:text-[var(--primary)]",
                  "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full",
                  "after:bg-[var(--primary)] after:origin-left after:scale-x-0",
                  "after:transition-transform after:duration-300 after:ease-in-out",
                  "hover:after:scale-x-100",
                  isActive
                    ? [
                        "text-[var(--primary)] font-medium after:scale-x-100",
                        "before:absolute before:-inset-2 before:-z-10 before:rounded-xl",
                        "before:bg-[var(--primary)] before:opacity-10 before:blur-md",
                        "before:shadow-[0_0_24px_var(--primary)]",
                      ].join(" ")
                    : "",
                  "motion-reduce:transition-none motion-reduce:after:transition-none",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


pill navbar:

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { focusRing, transitions } from "@/styles";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: "/till", label: t("nav.pos") },
    { href: "/menu", label: t("nav.menu") },
    { href: "/stock", label: t("nav.stock") },
    { href: "/statistics", label: t("nav.reports") },
    { href: "/account", label: t("nav.account") },
  ];

  return (
    <nav aria-label="Primary" className="hidden md:flex">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "relative inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium",
                  transitions,
                  focusRing,

               
                  "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",

            
                  "hover:bg-[var(--surface-2)]",

               
                  "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[2px]",
                  "after:bg-[var(--primary)] after:origin-left after:scale-x-0",
                  "after:transition-transform after:duration-300 after:ease-out",

                  "hover:after:scale-x-100",

          
                  isActive
                    ? [
                        "bg-[var(--surface-2)] text-[var(--primary)]",
                        "after:scale-x-100",
                      ].join(" ")
                    : "",

                  // motion safety
                  "motion-reduce:transition-none motion-reduce:after:transition-none",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}







*/
                  