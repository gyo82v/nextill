"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatMoney } from "@/lib/money";
import type { GlobalStats, ReportsGlobalProps } from "@/types";
import { cardBaseStyle } from "@/styles";
import { MenuSectionDivider } from "../ui/dividers/Dividers";
import { createMenuNameById, sortItemsSales } from "@/lib/reports";
import TopItems from "./TopItems";
import ItemsList from "./ItemsList";

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

            <div className={`flex w-full justify-between gap-4 px-8 py-4 ${cardBaseStyle}`}>
              <div>
                <div className="text-sm opacity-70">Total earnings</div>
                <div className="text-xl font-semibold">
                  {formatMoney(globalStats.totalEarnings, currency)}
                </div>
              </div>

              <div>
                <div className="text-sm opacity-70">Total transactions</div>
                <div className="text-xl font-semibold">
                  {globalStats.totalTransactions}
                </div>
              </div>

              <div>
                <div className="text-sm opacity-70">Units sold</div>
                <div className="text-xl font-semibold">
                  {globalStats.unitsSoldTotal}
                </div>
              </div>
            </div>
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
  );
}


/*

"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatMoney } from "@/lib/money";
import type { GlobalStats, ReportsGlobalProps } from "@/types";
import { cardBaseStyle } from "@/styles";
import { MenuSectionDivider } from "../ui/dividers/Dividers";
import { createMenuNameById, sortItemsSales } from "@/lib/reports";
import TopItems from "./TopItems";
import ItemsList from "./ItemsList";

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
  console.log("menu items:", menuItems)

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
    <section className="relative grid w-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start ">
  
      <div className="flex flex-col w-full justify-center ">

        <section className="max-w-2xl w-full mx-auto">
          <div className="mb-10 sm:mb-6 lg:mb-10">
            <h1 className="text-2xl font-semibold tracking-tight">Global overview</h1>
            <p className="mt-1 text-sm text-muted xl:max-w-[80%]">description here</p>
          </div>

          <div className={`flex justify-between w-full gap-4  py-4 px-8 ${cardBaseStyle}  `}>
            <div className=" ">
              <div className="text-sm opacity-70">Total earnings</div>
              <div className="text-xl font-semibold">
               {formatMoney(globalStats.totalEarnings, currency)}
              </div>
            </div>

            <div className=" ">
              <div className="text-sm opacity-70 ">Total transactions</div>
              <div className="text-xl font-semibold">
                {globalStats.totalTransactions}
              </div>
            </div>

            <div className=" ">
              <div className="text-sm opacity-70">Units sold</div>
              <div className="text-xl font-semibold">{globalStats.unitsSoldTotal}</div>
            </div>
          </div>
        </section>
  
        <section className="max-w-2xl w-full mx-auto">
          <h3 className="font-medium mb-4 ">Top 5 items</h3>
          <TopItems items={globalItemsSorted} menuNameById={menuNameById} />
        </section>
      </div>

      <MenuSectionDivider />

      <div className="max-w-2xl w-full mx-auto">
        <div className="mb-10 sm:mb-6 lg:mb-10">
          <h3 className="text-lg  tracking-tight">All items</h3>
          <p className="mt-1 text-sm">desctiption here</p>
        </div>

        <ItemsList items={globalItemsSorted} menuNameById={menuNameById} />
      </div>
    </section>
  );
}







*/