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

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

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
    return <div className="p-4 opacity-70">Loading global overview…</div>;
  }

  return (
     <section className="relative w-full lg:h-[700px]">
    <div className="grid h-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-stretch">
      {/* LEFT COLUMN */}
      <div className="flex h-full min-h-0 w-full flex-col">
        <section className="mx-auto w-full max-w-2xl">
          {/* Shared header height */}
          <div className="mb-8 min-h-[88px]">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Global overview
            </h1>
            <p className="mt-2 max-w-[80%] text-sm text-muted-foreground">
              description here
            </p>
          </div>

          <OverviewStats
            totalEarnings={globalStats.totalEarnings}
            totalTransactions={globalStats.totalTransactions}
            unitsSoldTotal={globalStats.unitsSoldTotal}
            currency={currency}
          />
        </section>

        <section className="mx-auto mt-auto w-full max-w-2xl">
          <div className="mb-4">
           <h3 className="text-lg font-medium tracking-tight text-foreground/90">
             Top items
           </h3>
          </div>

          <TopItems
            items={globalItemsSorted}
            menuNameById={menuNameById}
          />
        </section>
      </div>

      {/* RIGHT COLUMN */}
      <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col">
        {/* Same header height → perfect alignment */}
        <div className="mb-8 min-h-[88px] flex flex-col justify-end">
  <h3 className="text-lg font-medium tracking-tight text-foreground/90">
    All items
  </h3>
  <div className="mt-2 h-5" aria-hidden="true" />
</div>

        <div className="min-h-0 flex-1">
          <ItemsList
            items={globalItemsSorted}
            menuNameById={menuNameById}
          />
        </div>
      </div>
    </div>

    <MenuSectionDivider />
  </section>
  );
}


/*

  <section className="relative w-full lg:h-[600px]">
      <div className="grid h-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-stretch">
        <div className="flex h-full min-h-0 w-full flex-col">
          <section className="mx-auto w-full max-w-2xl">
            <div className="mb-10 sm:mb-6 lg:mb-10">
              <h1 className="text-2xl font-semibold tracking-tight">
                Global overview
              </h1>
              <p className="mt-1 text-sm text-muted xl:max-w-[80%]">
                description here
              </p>
            </div>

            <OverviewStats 
              totalEarnings={globalStats.totalEarnings} 
              totalTransactions={globalStats.totalTransactions} 
              unitsSoldTotal={globalStats.unitsSoldTotal} 
              currency={currency}  
            />    
          </section>

          <section className="mx-auto mt-auto w-full max-w-2xl">
            <h3 className="mb-4 font-medium">Top 5 items</h3>
            <TopItems items={globalItemsSorted} menuNameById={menuNameById} />
          </section>
        </div>

        <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col">
          <div className="mb-10 sm:mb-6 lg:mb-10">
            <h3 className="text-lg tracking-tight">All items</h3>
            <p className="mt-1 text-sm">description here</p>
          </div>

          <div className="min-h-0 flex-1">
            <ItemsList items={globalItemsSorted} menuNameById={menuNameById} />
          </div>
        </div>
      </div>

      <MenuSectionDivider />
    </section>









*/