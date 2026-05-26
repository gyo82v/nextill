"use client";

import { cardBaseStyle } from "@/styles";
import type { TopItemsProps } from "@/types";
import { useTranslation } from "react-i18next";

export default function TopItems({ items, menuNameById }: TopItemsProps) {
  const {t} = useTranslation("reports")
  const topItems = items.slice(0, 5);
  const slots = Array.from({ length: 5 }, (_, i) => topItems[i] ?? null);

  const getRankStyles = (rank: number) => {
    if (rank === 1) {
      return {
        badge:
          "bg-yellow-500/15 text-yellow-700 border-yellow-500/30 dark:text-yellow-300",
        card: "border-yellow-500/20",
      };
    }

    if (rank === 2) {
      return {
        badge:
          "bg-sky-500/15 text-sky-700 border-sky-500/30 dark:text-sky-300",
        card: "border-sky-500/20",
      };
    }

    if (rank === 3) {
      return {
        badge:
          "bg-orange-500/15 text-orange-700 border-orange-500/30 dark:text-orange-300",
        card: "border-orange-500/20",
      };
    }

    return {
      badge: "bg-surface-2 text-muted-foreground border-default",
      card: "border-default",
    };
  };

  return (
    <div
      className={`grid grid-cols-2 gap-4 p-4 lg:grid-cols-3 lg:gap-6 ${cardBaseStyle}`}
    >
      {slots.map((item, i) => {
        const rank = i + 1;
        const styles = getRankStyles(rank);

        return (
          <div
            key={rank}
            className={`flex min-h-[140px] flex-col rounded-2xl border bg-surface-1
                        p-4 shadow-sm ${styles.card}`}
          >
            {/* Rank badge */}
            <div className="flex justify-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full
                            border text-sm font-semibold ${styles.badge}`}
              >
                {rank}
              </div>
            </div>

            {/* Item name / placeholder */}
            <div className="mt-4 flex flex-1 items-center justify-center text-center">
              {item ? (
                <div className="line-clamp-2 text-sm font-semibold text-foreground">
                  {menuNameById.get(item[0]) ?? item[0]}
                </div>
              ) : (
                <div className="line-clamp-2 text-sm font-medium text-muted-foreground/60">
                  {t("global.topItems.noDataYet")}
                </div>
              )}
            </div>

            {/* Units sold / placeholder */}
            <div className="mt-3 text-center text-xs text-muted-foreground">
              {item
                ? t("global.topItems.sold", { count: item[1] })
                : "—"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
