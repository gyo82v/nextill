"use client";

import { formatMoney } from "@/lib/money";
import { useAuth } from "@/firebase/authProvider";
import { cardBaseStyle, focusRing, posDishCard } from "@/styles";
import { FiPlus } from "react-icons/fi";
import type { MenuItemCardProps } from "@/types/pos";
import { useTranslation } from "react-i18next";
import {categoryStyles} from "@/styles"

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
