"use client";

import { cardBaseStyle } from "@/styles";
import { formatMoney } from "@/lib/money";

type OverviewStatsProps = {
  totalEarnings: number;
  totalTransactions: number;
  unitsSoldTotal: number;
  currency: string;
};

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-default bg-surface-1 p-4 shadow-sm">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

export default function OverviewStats({
  totalEarnings,
  totalTransactions,
  unitsSoldTotal,
  currency,
}: OverviewStatsProps) {
  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${cardBaseStyle} p-4`}>
      <StatCard
        label="Total earnings"
        value={formatMoney(totalEarnings, currency)}
      />
      <StatCard
        label="Total transactions"
        value={totalTransactions}
      />
      <StatCard
        label="Units sold"
        value={unitsSoldTotal}
      />
    </div>
  );
}