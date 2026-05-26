"use client";

import { cardBaseStyle } from "@/styles";
import { useTranslation } from "react-i18next";
import type { ItemsListProps } from "@/types";

export default function ItemsList({ items, menuNameById }: ItemsListProps) {
  const {t} = useTranslation("reports")
  return (
    <div className={`${cardBaseStyle} flex h-full min-h-0 flex-col overflow-hidden p-4`}>
      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {t("global.allItems.emptyState")}
          </div>
        ) : (
          <div className="divide-y divide-slate-300/40 dark:divide-slate-500/25">
            {items.map(([id, qty]) => (
              <div
                key={id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {menuNameById.get(id) ?? id}
                </span>

                <span className={`shrink-0 rounded-full border border-default
                                  bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground`}>
                  {t("global.allItems.unitSold")} {qty}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}