"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

import type { DaySummary, ReportsCurrentDayProps } from "@/types";

import { MenuSectionDivider } from "../ui/dividers/Dividers";
import { createMenuNameById, sortItemsSales } from "@/lib/reports";

import OverviewStats from "./OverviewStats";
import TopItems from "./TopItems";
import ItemsList from "./ItemsList";
import { MobileDivider } from "../ui/dividers/Dividers";
import { useTranslation } from "react-i18next";

export default function ReportsCurrentDay({
  userId,
  dayKey,
  currency,
  menuItems,
}: ReportsCurrentDayProps) {
  const [loading, setLoading] = useState(true);
  const [currentDayStats, setCurrentDayStats] = useState<DaySummary | null>(null);
  const { t } = useTranslation("reports");

  useEffect(() => {
    if (!userId || !dayKey) {
      queueMicrotask(() => {
        setCurrentDayStats(null);
        setLoading(false);
      });
      return;
    }

    queueMicrotask(() => {
      setLoading(true);
    });

    const dayRef = doc(db, "users", userId, "dailySummaries", dayKey);

    const unsubscribe = onSnapshot(dayRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as DaySummary;

        setCurrentDayStats({
          date: data.date ?? dayKey,
          earnings: Number(data.earnings ?? 0),
          transactions: Number(data.transactions ?? 0),
          unitsSoldTotal: Number(data.unitsSoldTotal ?? 0),
          itemsSales: (data.itemsSales ?? {}) as Record<string, number>,
          mostSoldItem: data.mostSoldItem ?? null,
          updatedAt: data.updatedAt,
        });
      } else {
        setCurrentDayStats(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [userId, dayKey]);

  const menuNameById = createMenuNameById(menuItems);
  const currentDayItemsSorted = sortItemsSales(currentDayStats?.itemsSales);

  if (loading) {
    return <div className="p-4 opacity-70">{t("currentDay.loading")}</div>;
  }

  return (
    <section className="relative w-full lg:h-[700px]">
      <div className="grid h-full grid-cols-1 lg:gap-14 lg:grid-cols-2 lg:items-stretch">
        {/* LEFT COLUMN */}
        <div className="flex h-full min-h-0 w-full flex-col">
          <section className="mx-auto w-full max-w-2xl">
            <div className="mb-4 lg:mb-8 min-h-[88px]">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {t("currentDay.title")}
              </h1>
              <p className="mt-2 max-w-[80%] text-sm text-muted-foreground">
                {t("currentDay.description")}
              </p>
            </div>

            <OverviewStats
              totalEarnings={currentDayStats?.earnings ?? 0}
              totalTransactions={currentDayStats?.transactions ?? 0}
              unitsSoldTotal={currentDayStats?.unitsSoldTotal ?? 0}
              currency={currency}
            />
          </section>

          <MobileDivider className="my-14" />

          <section className="mx-auto mt-auto w-full max-w-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-medium tracking-tight text-foreground/90">
                {t("currentDay.topItemsTitle")}
              </h3>
            </div>

            <TopItems items={currentDayItemsSorted} menuNameById={menuNameById} />
          </section>
        </div>

        <MobileDivider className="mt-14 mb-6" />

        {/* RIGHT COLUMN */}
        <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col">
          <div className="lg:mb-8 min-h-[88px] flex flex-col justify-end">
            <h3 className="text-lg font-medium tracking-tight text-foreground/90">
              {t("currentDay.allItemsTitle")}
            </h3>
            <div className="mt-2 h-5" aria-hidden="true" />
          </div>

          <div className="min-h-0 flex-1">
            <ItemsList items={currentDayItemsSorted} menuNameById={menuNameById} />
          </div>
        </div>
      </div>

      <MenuSectionDivider className="hidden lg:flex" />
      <MobileDivider className="my-14" />
    </section>
  );
}
