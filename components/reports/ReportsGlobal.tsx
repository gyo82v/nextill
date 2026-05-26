"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import type { GlobalStats, ReportsGlobalProps } from "@/types";
import { MenuSectionDivider } from "../ui/dividers/Dividers";
import { createMenuNameById, sortItemsSales } from "@/lib/reports";
import TopItems from "./TopItems";
import ItemsList from "./ItemsList";
import OverviewStats from "./OverviewStats";
import { MobileDivider } from "../ui/dividers/Dividers";
import { useTranslation } from "react-i18next";

export default function ReportsGlobal({
  userId,
  currency,
  menuItems,
}: ReportsGlobalProps) {
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalEarnings: 0,
    totalTransactions: 0,
    unitsSoldTotal: 0,
    itemsSales: {},
  });
  const { t } = useTranslation("reports");

  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        const stats = snap.data()?.nextillApp?.statistics ?? {};

        setGlobalStats({
          totalEarnings: Number(stats.totalEarnings ?? 0),
          totalTransactions: Number(stats.totalTransactions ?? 0),
          unitsSoldTotal: Number(stats.unitsSoldTotal ?? 0),
          itemsSales: (stats.itemsSales ?? {}) as Record<string, number>,
          lastSaleAt: stats.lastSaleAt,
        });

        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  const menuNameById = createMenuNameById(menuItems);
  const globalItemsSorted = sortItemsSales(globalStats.itemsSales);

  if (loading) {
    return <div className="p-4 opacity-70">{t("global.loading")}</div>;
  }

  return (
    <section className="relative w-full lg:h-[700px]">
      <div className="grid h-full grid-cols-1 lg:gap-14 lg:grid-cols-2 lg:items-stretch">
        {/* LEFT COLUMN */}
        <div className="flex h-full min-h-0 w-full flex-col">
          <section className="mx-auto w-full max-w-2xl">
            {/* Shared header height */}
            <div className="mb-4 min-h-[88px] lg:mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {t("global.title")}
              </h1>
              <p className="mt-2 max-w-[80%] text-sm text-muted-foreground">
                {t("global.description")}
              </p>
            </div>

            <OverviewStats
              totalEarnings={globalStats.totalEarnings}
              totalTransactions={globalStats.totalTransactions}
              unitsSoldTotal={globalStats.unitsSoldTotal}
              currency={currency}
            />
          </section>

          <MobileDivider className="my-14" />

          <section className="mx-auto mt-auto w-full max-w-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-medium tracking-tight text-foreground/90">
                {t("global.topItemsTitle")}
              </h3>
            </div>

            <TopItems items={globalItemsSorted} menuNameById={menuNameById} />
          </section>
        </div>

        <MobileDivider className="mt-14 mb-6" />

        {/* RIGHT COLUMN */}
        <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col">
          {/* Same header height → perfect alignment */}
          <div className="min-h-[88px] flex flex-col justify-end lg:mb-8">
            <h3 className="text-lg font-medium tracking-tight text-foreground/90">
              {t("global.allItemsTitle")}
            </h3>
            <div className="mt-2 h-5" aria-hidden="true" />
          </div>

          <div className="min-h-0 flex-1">
            <ItemsList items={globalItemsSorted} menuNameById={menuNameById} />
          </div>
        </div>
      </div>

      <MenuSectionDivider className="hidden lg:flex" />
      <MobileDivider className="my-14" />
    </section>
  );
}
