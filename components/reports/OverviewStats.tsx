"use client";

import { cardBaseStyle } from "@/styles";
import { formatMoney } from "@/lib/money";
import { FiTrendingUp, FiShoppingCart, FiBox } from "react-icons/fi";

type OverviewStatsProps = {
  totalEarnings: number;
  totalTransactions: number;
  unitsSoldTotal: number;
  currency: string;
};

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
};

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-default bg-surface-1 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </div>

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
        icon={<FiTrendingUp />}
      />

      <StatCard
        label="Total transactions"
        value={totalTransactions}
        icon={<FiShoppingCart />}
      />

      <StatCard
        label="Units sold"
        value={unitsSoldTotal}
        icon={<FiBox />}
      />
    </div>
  );
}