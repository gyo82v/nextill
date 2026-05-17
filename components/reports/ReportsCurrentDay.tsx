"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatMoney } from "@/lib/money";
import type { DaySummary, TransactionDoc, TransactionRow } from "@/types";
import type { MenuItem } from "@/firebase/menu";

type ReportsCurrentDayProps = {
  userId: string;
  dayKey: string | null;
  currency: string;
  menuItems: MenuItem[];
};

export default function ReportsCurrentDay({
  userId,
  dayKey,
  currency,
  menuItems,
}: ReportsCurrentDayProps) {
  const [loading, setLoading] = useState(true);
  const [currentDayStats, setCurrentDayStats] = useState<DaySummary | null>(
    null
  );
  const [currentDayTransactions, setCurrentDayTransactions] = useState<
    TransactionRow[]
  >([]);
  const [showCurrentDayTransactions, setShowCurrentDayTransactions] =
    useState(false);

  useEffect(() => {
    if (!userId || !dayKey) {
      setCurrentDayStats(null);
      setCurrentDayTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const dayRef = doc(db, "users", userId, "dailySummaries", dayKey);
    const transactionsRef = collection(
      db,
      "users",
      userId,
      "dailySummaries",
      dayKey,
      "transactions"
    );

    let dayReady = false;
    let transactionsReady = false;

    const finishLoading = () => {
      if (dayReady && transactionsReady) {
        setLoading(false);
      }
    };

    const unsubscribeDay = onSnapshot(dayRef, (snap) => {
      if (snap.exists()) {
        const dayData = snap.data() as DaySummary;

        setCurrentDayStats({
          date: dayData.date ?? dayKey ?? "",
          earnings: Number(dayData.earnings ?? 0),
          transactions: Number(dayData.transactions ?? 0),
          unitsSoldTotal: Number(dayData.unitsSoldTotal ?? 0),
          itemsSales: (dayData.itemsSales ?? {}) as Record<string, number>,
          mostSoldItem: dayData.mostSoldItem ?? null,
          updatedAt: dayData.updatedAt,
        });
      } else {
        setCurrentDayStats(null);
      }

      dayReady = true;
      finishLoading();
    });

    const unsubscribeTransactions = onSnapshot(
      query(transactionsRef, orderBy("createdAt", "desc")),
      (snap) => {
        setCurrentDayTransactions(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as TransactionDoc),
          }))
        );

        transactionsReady = true;
        finishLoading();
      }
    );

    return () => {
      unsubscribeDay();
      unsubscribeTransactions();
    };
  }, [userId, dayKey]);

  const menuNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of menuItems) {
      map.set(item.id, item.name);
    }
    return map;
  }, [menuItems]);

  const currentDayItemsSorted = useMemo(() => {
    return currentDayStats?.itemsSales
      ? Object.entries(currentDayStats.itemsSales).sort((a, b) => b[1] - a[1])
      : [];
  }, [currentDayStats]);

  if (loading) {
    return <div className="p-4 opacity-70">Loading current day report…</div>;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium">Current day item sales</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border p-4">
          <div className="text-sm opacity-70">Earnings</div>
          <div className="text-xl font-semibold">
            {formatMoney(currentDayStats?.earnings ?? 0, currency)}
          </div>
        </div>

        <div className="rounded border p-4">
          <div className="text-sm opacity-70">Transactions</div>
          <div className="text-xl font-semibold">
            {currentDayStats?.transactions ?? 0}
          </div>
        </div>

        <div className="rounded border p-4">
          <div className="text-sm opacity-70">Units sold</div>
          <div className="text-xl font-semibold">
            {currentDayStats?.unitsSoldTotal ?? 0}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Top 5 items</h3>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {currentDayItemsSorted.slice(0, 5).map(([id, qty], i) => (
            <div key={id} className="rounded border p-4">
              <div className="text-sm opacity-70">#{i + 1}</div>
              <div className="font-medium">
                {menuNameById.get(id) ?? id}
              </div>
              <div className="text-sm opacity-70">Sold: {qty}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">Current day transactions</h2>

          <button
            type="button"
            onClick={() => setShowCurrentDayTransactions((prev) => !prev)}
            className="rounded border px-3 py-2 text-sm"
          >
            {showCurrentDayTransactions ? "Hide" : "Show"}
          </button>
        </div>

        {showCurrentDayTransactions ? (
          currentDayTransactions.length > 0 ? (
            <div className="space-y-3">
              {currentDayTransactions.map((tx) => (
                <div key={tx.id} className="rounded border p-4 space-y-3">
                  <div className="flex justify-between gap-4">
                    <div>
                      <div className="text-sm opacity-70">Transaction ID</div>
                      <div className="font-medium break-all">{tx.id}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm opacity-70">Total</div>
                      <div className="font-medium">
                        {formatMoney(tx.totalMinor, currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="opacity-70">No transactions for the current day.</p>
          )
        ) : (
          <p className="opacity-70">Transactions hidden.</p>
        )}
      </section>
    </section>
  );
}