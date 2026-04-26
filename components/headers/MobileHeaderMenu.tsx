"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import UserSection from "@/components/headers/UserSection";
import { navItems } from "@/components/headers/navItems";
import { activePress, focusRing, transitions } from "@/styles";

type MobileHeaderMenuProps = {
  open: boolean;
  onClose: () => void;
};

const ANIMATION_DURATION = 300;

export default function MobileHeaderMenu({
  open,
  onClose,
}: MobileHeaderMenuProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    let timeoutId: ReturnType<typeof window.setTimeout> | undefined;
    let rafId: number | undefined;

    if (open) {
      setMounted(true);
      rafId = window.requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(false);
      timeoutId = window.setTimeout(() => {
        setMounted(false);
      }, ANIMATION_DURATION);
    }

    return () => {
      if (rafId !== undefined) {
        window.cancelAnimationFrame(rafId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      id="mobile-header-menu"
      className="fixed inset-0 z-[60] md:hidden"
      aria-hidden={!visible}
    >
      <div
        className={[
          "absolute inset-0 bg-black/30",
          "transition-opacity duration-300 ease-in-out motion-reduce:transition-none",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={[
          "absolute right-0 top-0 h-dvh w-[min(88vw,22rem)]",
          "border-l border-default bg-surface-1 shadow-2xl",
          "overflow-y-auto will-change-transform transform-gpu",
          "transition-[transform,opacity] duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none",
          visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-default px-4 py-3">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            Menu
          </span>

          <button
            type="button"
            className={[
              "inline-flex h-10 w-10 items-center justify-center rounded-xl",
              "bg-surface-2 text-[var(--foreground)]",
              "hover-surface-1",
              focusRing,
              transitions,
              activePress,
            ].join(" ")}
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <nav aria-label="Mobile primary" className="px-4 py-6">
          <ul className="space-y-5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onClose}
                    className={[
                      "flex items-center rounded-xl px-4 py-4 text-base font-medium",
                      "border border-transparent",
                      transitions,
                      focusRing,
                      activePress,
                      isActive
                        ? "border-[var(--border)] bg-surface-2 text-[var(--primary)]"
                        : "text-[var(--muted)] hover:bg-surface-2 hover:text-[var(--foreground)]",
                    ].join(" ")}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-default px-4 py-6">
          <UserSection />
        </div>
      </aside>
    </div>
  );
}