"use client";

import { cardBaseStyle } from "@/styles";
import { formatMoney } from "@/lib/money";
import { FiTrendingUp, FiShoppingCart, FiBox } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import type { OverviewStatsProps } from "@/types";
import StatCard from "./StatCard";


export default function OverviewStats({
  totalEarnings,
  totalTransactions,
  unitsSoldTotal,
  currency,
}: OverviewStatsProps) {
  const {t} = useTranslation("reports")
  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${cardBaseStyle} p-4`}>
      <StatCard
        label={t("global.overviewStats.totalEarnings")}
        value={formatMoney(totalEarnings, currency)}
        icon={<FiTrendingUp />}
      />

      <StatCard
        label={t("global.overviewStats.totalTransactions")}
        value={totalTransactions}
        icon={<FiShoppingCart />}
      />

      <StatCard
        label={t("global.overviewStats.unitSold")}
        value={unitsSoldTotal}
        icon={<FiBox />}
      />
    </div>
  );
}