"use client";

import { formatMoney } from "@/lib/money";
import { cardBaseStyle } from "@/styles";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import type { DailyOverviewCardProps } from "@/types";

export default function DailyOverviewCard({
  day,
  currency,
  mostSoldName,
  previousEarnings,
}: DailyOverviewCardProps) {
  const {t} = useTranslation("reports")
  console.log("day: ", day)
  const trend =
    previousEarnings == null
      ? "none"
      : day.earnings > previousEarnings
      ? "up"
      : day.earnings < previousEarnings
      ? "down"
      : "flat";

  return (
    <article className={`${cardBaseStyle} p-4`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* LEFT SIDE */}
        <div className="min-w-0">
          <div className="font-medium text-foreground">{day.date}</div>

          <div className="mt-1 text-sm text-muted-foreground">
            {t("dailyOverview.card.transaction", { count: day.transactions })} ·{" "}
            {t("dailyOverview.card.unit", { count: day.unitsSoldTotal ?? 0 })}
          </div>


         {day.openingBalance != null && day.closingBalance != null && (
  <div className="mt-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">
        {t("dailyOverview.card.openingBalance")}
        </span>
      <span className="font-medium text-foreground">
        {formatMoney(day.openingBalance, currency)}
      </span>
    </div>

    <div className="mt-1.5 flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">
        {t("dailyOverview.card.closingBalance")}
      </span>
      <span className="font-medium text-foreground">
        {formatMoney(day.closingBalance, currency)}
      </span>
    </div>
  </div>
)}
        </div>

        {/* RIGHT SIDE */}
        <div className="shrink-0 text-right space-y-1">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("dailyOverview.card.earnings")}
          </div>

          <div className="mt-1 flex items-center justify-end gap-1.5">
            <span className="text-sm font-semibold text-foreground">
              {formatMoney(day.earnings, currency)}
            </span>

            {trend === "up" && (
              <FiTrendingUp className="h-4 w-4 text-emerald-500/80" />
            )}
            {trend === "down" && (
              <FiTrendingDown className="h-4 w-4 text-rose-500/80" />
            )}
            {trend === "flat" && (
              <FiMinus className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            {t("dailyOverview.card.mostSold")} {mostSoldName ?? "—"}
          </div>
        </div>
      </div>
    </article>
  );
}
