"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLayoutEffect, useRef, useState } from "react";
import { focusRing, transitions } from "@/styles";
import { navItems } from "@/components/headers/navItems";

export default function Navbar() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  const containerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });

  const updateIndicator = () => {
    const index = navItems.findIndex(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`)
    );

    const el = itemRefs.current[index];
    const container = containerRef.current;

    if (!el || !container) return;

    setIndicator({
      left: el.offsetLeft,
      width: el.offsetWidth,
    });
  };

  useLayoutEffect(() => {
    updateIndicator();
  }, [pathname, i18n.language]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      updateIndicator();
    });

    observer.observe(container);

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    window.addEventListener("resize", updateIndicator);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname, i18n.language]);

  return (
    <nav aria-label="Primary" className="hidden md:flex">
      <div className="relative">
        <ul
          ref={containerRef}
          className="relative flex items-center lg:gap-5 xl:gap-10 rounded-xl bg-surface-1 p-2 xl:px-4"
        >
          {/* Sliding indicator */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-1 left-0 rounded-lg bg-[var(--surface-2)]
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
      </div>
    </nav>
  );
}


                  