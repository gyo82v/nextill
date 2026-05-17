"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatMoney } from "@/lib/money";
import type { DaySummary, DaySummaryRow } from "@/types";
import type { MenuItem } from "@/firebase/menu";

type ReportsDayOverviewProps = {
  userId: string;
  currency: string;
  menuItems: MenuItem[];
};

export default function ReportsDayOverview({
  userId,
  currency,
  menuItems,
}: ReportsDayOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [dailySummaries, setDailySummaries] = useState<DaySummaryRow[]>([]);

  useEffect(() => {
    if (!userId) {
      setDailySummaries([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const summariesRef = query(
      collection(db, "users", userId, "dailySummaries"),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(
      summariesRef,
      (snap) => {
        setDailySummaries(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as DaySummary),
          }))
        );
        setLoading(false);
      },
      () => {
        setDailySummaries([]);
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

  if (loading) {
    return <div className="p-4 opacity-70">Loading daily overview…</div>;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium">Daily overview</h2>

      {dailySummaries.length > 0 ? (
        <div className="space-y-2">
          {dailySummaries.map((day) => (
            <div key={day.id} className="rounded border p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{day.date}</div>
                  <div className="text-sm opacity-70">
                    Transactions: {day.transactions} · Units sold:{" "}
                    {day.unitsSoldTotal ?? 0}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium">
                    {formatMoney(day.earnings, currency)}
                  </div>
                  <div className="text-sm opacity-70">
                    Most sold:{" "}
                    {day.mostSoldItem
                      ? menuNameById.get(day.mostSoldItem) ?? day.mostSoldItem
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="opacity-70">No daily summaries yet.</p>
      )}
    </section>
  );
}