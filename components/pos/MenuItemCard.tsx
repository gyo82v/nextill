"use client";

import { formatMoney } from "@/lib/money";
import { useAuth } from "@/firebase/authProvider";
import { cardBaseStyle, focusRing, posDishCard } from "@/styles";
import { FiPlus } from "react-icons/fi";
import type { MenuItemCardProps } from "@/types/pos";
import { useTranslation } from "react-i18next";

const categoryStyles: Record<string, string> = {
  food:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  drink:
    "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  bundle:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  dessert:
    "border-pink-500/20 bg-pink-500/10 text-pink-700 dark:text-pink-300",
  default:
    "border-default bg-surface-2 text-muted-foreground",
};

export default function MenuItemCard({
  item,
  onAdd,
  categoryLabel,
  categoryIcon,
}: MenuItemCardProps) {
  const { profile } = useAuth();
  const currency = profile?.nextillApp.settings.currency ?? "EUR";

  const categoryKey = item.category || "default";
  const badgeStyle = categoryStyles[categoryKey] ?? categoryStyles.default;

  const { t } = useTranslation("pos");

  return (
    <button
      type="button"
      onClick={() => onAdd(item)}
      aria-label={t("menu.addToCartAriaLabel", { itemName: item.name })}
      className={`${cardBaseStyle} ${focusRing} ${posDishCard}
                  group flex h-full w-full flex-col justify-between gap-3 rounded-2xl
                  border border-default p-3 text-left`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate text-[15px] font-semibold leading-snug">
            {item.name}
          </h3>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5
                        text-[11px] font-medium uppercase tracking-wide 
                        ${badgeStyle}`}
          >
            {categoryIcon}
            {categoryLabel ?? item.category}
          </span>
        </div>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                      border border-default bg-surface-2 text-muted-foreground
                      transition-transform duration-200 ease-out group-hover:scale-105`}
          aria-hidden="true"
        >
          <FiPlus className="text-sm" />
        </span>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          {t("menu.addToCartText")}
        </div>

        <div className="text-[15px] font-semibold text-foreground">
          {formatMoney(item.priceMinor, currency)}
        </div>
      </div>
    </button>
  );
}
