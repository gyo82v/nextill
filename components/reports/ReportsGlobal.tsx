"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatMoney } from "@/lib/money";
import type { GlobalStats, ReportsGlobalProps } from "@/types";
import { cardBaseStyle } from "@/styles";
import { MenuSectionDivider } from "../ui/dividers/Dividers";
import { createMenuNameById, sortItemsSales } from "@/lib/reports";

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
      {/*first column */}
      <div className="flex flex-col w-full justify-center ">
        {/*Global overview */}
        <div className="max-w-2xl w-full mx-auto">
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
        </div>
        {/*top 5 items */}
        <div className="max-w-2xl w-full mx-auto">
          <h3 className="font-medium mb-4 ">Top 5 items</h3>

          <div className={`flex flex-col ${cardBaseStyle} p-4`}>
            {globalItemsSorted.slice(0, 5).map(([id, qty], i) => (
              <div key={id} className="">
                <div className="text-sm opacity-70">#{i + 1}</div>
                <div className="font-medium">{menuNameById.get(id) ?? id}</div>
                <div className="text-sm opacity-70">Sold: {qty}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MenuSectionDivider />
      {/*second column/all items */}
      <div className="max-w-2xl w-full mx-auto">
        <div className="mb-10 sm:mb-6 lg:mb-10">
          <h3 className="text-lg  tracking-tight">All items</h3>
          <p className="mt-1 text-sm">desctiption here</p>
        </div>

         <div className={`${cardBaseStyle}  p-4`}>
            {globalItemsSorted.map(([id, qty]) => (
              <div
                key={id}
                className="flex items-center justify-between"
              >
                <span>{menuNameById.get(id) ?? id}</span>
                <span className="opacity-70">{qty}</span>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}