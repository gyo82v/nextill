"use client";

import { useAuth } from "@/firebase/authProvider";
import { formatMoney } from "@/lib/money";
import { FaCartShopping } from "react-icons/fa6";
import type {MobileCartBarProps} from "@/types/pos";
import { useTranslation } from "react-i18next";

export default function MobileCartBar({
  itemCount,
  totalMinor,
  onOpen,
}: MobileCartBarProps) {
  const { profile } = useAuth();
  const currency = profile?.nextillApp.settings.currency ?? "EUR";
  const { t } = useTranslation("pos");

  if (itemCount === 0) return null;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={t("mobile.openCartAriaLabel", { count: itemCount })}
      className={`fixed bottom-4 right-4 z-40 flex items-center gap-3
                  rounded-2xl border border-default bg-surface-1/95 backdrop-blur
                  px-4 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 shadow-lg shadow-black/10
                  hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md
                  transition-all lg:hidden`}
    >
      {/* Icon + badge */}
      <span className={`relative inline-flex h-11 w-11 items-center justify-center
                        rounded-full bg-surface-2 border border-default`}>
        <FaCartShopping className="text-base text-muted-foreground" />

        <span
          className={`absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-[1.25rem]
                      items-center justify-center rounded-full bg-[var(--primary)]
                      px-1 text-[11px] font-semibold text-[var(--primary-foreground)] shadow-md`}
        >
          {itemCount}
        </span>
      </span>

      {/* Text */}
      <span className="flex flex-col text-left leading-tight">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {t("mobile.cartTitle")}
        </span>

        <span className="text-sm font-semibold tracking-tight">
          {formatMoney(totalMinor, currency)}
        </span>
      </span>
    </button>
  );
}
