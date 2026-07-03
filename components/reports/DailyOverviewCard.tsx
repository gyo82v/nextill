"use client";

import { formatMoney } from "@/lib/money";
import { cardBaseStyle } from "@/styles";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import type { DailyOverviewCardProps } from "@/types";
import DailyOverviewStatsCard from "./DailyOverviewStatsCard";

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
           
          <div className="mt-3 flex flex-col xl:flex-row gap-3">

          {
            day.openingBalance != null && day.closingBalance != null &&
            <DailyOverviewStatsCard
              title1={t("dailyOverview.card.openingBalance")}
              title2={t("dailyOverview.card.closingBalance")}
              value1={formatMoney(day.openingBalance, currency)}
              value2={formatMoney(day.closingBalance, currency)}
            />
          }
          
          {
            (day.cardEarnings != null || day.cashEarnings != null) &&
            <DailyOverviewStatsCard
              title1={t("dailyOverview.card.card")}
              title2={t("dailyOverview.card.cash")}
              value1={day.cardEarnings != null ? formatMoney(day.cardEarnings, currency) : "—"}
              value2={day.cashEarnings != null ? formatMoney(day.cashEarnings, currency) : "—"}
            />
          }
          
          </div>
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

