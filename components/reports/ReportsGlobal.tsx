"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatMoney } from "@/lib/money";
import type { GlobalStats } from "@/types";
import type { MenuItem } from "@/firebase/menu";

type ReportsGlobalProps = {
  userId: string;
  currency: string;
  menuItems: MenuItem[];
};

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

  const menuNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of menuItems) {
      map.set(item.id, item.name);
    }
    return map;
  }, [menuItems]);

  const globalItemsSorted = useMemo(() => {
    return Object.entries(globalStats.itemsSales).sort((a, b) => b[1] - a[1]);
  }, [globalStats.itemsSales]);

  if (loading) {
    return <div className="p-4 opacity-70">Loading global overview…</div>;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium">Global overview</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border p-4">
          <div className="text-sm opacity-70">Total earnings</div>
          <div className="text-xl font-semibold">
            {formatMoney(globalStats.totalEarnings, currency)}
          </div>
        </div>

        <div className="rounded border p-4">
          <div className="text-sm opacity-70">Total transactions</div>
          <div className="text-xl font-semibold">
            {globalStats.totalTransactions}
          </div>
        </div>

        <div className="rounded border p-4">
          <div className="text-sm opacity-70">Units sold</div>
          <div className="text-xl font-semibold">{globalStats.unitsSoldTotal}</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">Top 5 items</h3>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {globalItemsSorted.slice(0, 5).map(([id, qty], i) => (
              <div key={id} className="rounded border p-4">
                <div className="text-sm opacity-70">#{i + 1}</div>
                <div className="font-medium">{menuNameById.get(id) ?? id}</div>
                <div className="text-sm opacity-70">Sold: {qty}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">All items</h3>
          <div className="space-y-2">
            {globalItemsSorted.map(([id, qty]) => (
              <div
                key={id}
                className="flex items-center justify-between rounded border px-4 py-2"
              >
                <span>{menuNameById.get(id) ?? id}</span>
                <span className="opacity-70">{qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}