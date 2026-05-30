"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import UserSection from "@/components/headers/UserSection";
import { navItems } from "@/components/headers/navItems";
import { activePress, focusRing, transitions, iconsBtn } from "@/styles";
import { FiX } from "react-icons/fi";
import type { MobileHeaderMenuProps } from "@/types";
import Drawer from "@/components/ui/drawers/Drawer";

export default function MobileHeaderMenu({
  open,
  onClose,
}: MobileHeaderMenuProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const closeMenu = () => {
    if (typeof document !== "undefined") {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }

    onClose();
  };

  return (
    <Drawer open={open} onClose={closeMenu} side="right">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-default px-4 py-5">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            {t("nav.labelMobile")}
          </span>

          <button
            type="button"
            className={iconsBtn}
            aria-label="Close navigation menu"
            onClick={closeMenu}
          >
            <span className="text-xl leading-none">
              <FiX className="h-5 w-5" aria-hidden="true" />
            </span>
          </button>
        </div>

        <nav aria-label="Mobile primary" className="px-4 py-14">
          <ul className="space-y-0">
            {navItems.map((item, index) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li
                  key={item.href}
                  className={`${
                    index > 0
                      ? "border-t border-slate-200/60 dark:border-slate-700/60"
                      : ""
                  }`}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={closeMenu}
                    className={[
                      "flex items-center rounded-xl px-4 py-6 text-base font-medium",
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

        <div className="mt-auto border-t border-default px-4 py-6">
          <UserSection />
        </div>
      </div>
    </Drawer>
  );
}
