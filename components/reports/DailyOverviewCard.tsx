"use client";

import { formatMoney } from "@/lib/money";
import { cardBaseStyle } from "@/styles";
import type { DaySummaryRow } from "@/types";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

type DailyOverviewCardProps = {
  day: DaySummaryRow;
  currency: string;
  mostSoldName?: string;
  previousEarnings?: number;
};

export default function DailyOverviewCard({
  day,
  currency,
  mostSoldName,
  previousEarnings,
}: DailyOverviewCardProps) {
  const trend =
    previousEarnings == null
      ? "none"
      : day.earnings > previousEarnings
      ? "up"
      : day.earnings < previousEarnings
      ? "down"
      : "flat";

  return (
    <div className={`${cardBaseStyle} p-4`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* LEFT SIDE */}
        <div className="min-w-0">
          <div className="font-medium text-foreground">{day.date}</div>

          <div className="mt-1 text-sm text-muted-foreground">
            {day.transactions} transactions · {day.unitsSoldTotal ?? 0} units
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="shrink-0 text-right">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Earnings
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
            Most sold: {mostSoldName ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}


/*

"use client";

import { formatMoney } from "@/lib/money";
import { cardBaseStyle } from "@/styles";
import type { DaySummaryRow } from "@/types";

type DailyOverviewCardProps = {
  day: DaySummaryRow;
  currency: string;
  mostSoldName?: string;
};

export default function DailyOverviewCard({
  day,
  currency,
  mostSoldName,
}: DailyOverviewCardProps) {
  return (
    <div
      className={`${cardBaseStyle} rounded-2xl border border-default bg-surface-1 p-4 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground">
            {day.date}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            Transactions: {day.transactions} · Units sold:{" "}
            {day.unitsSoldTotal ?? 0}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Earnings
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            {formatMoney(day.earnings, currency)}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            Most sold: {mostSoldName ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}



*/