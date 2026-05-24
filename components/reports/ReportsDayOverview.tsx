"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatMoney } from "@/lib/money";
import type { DaySummary, DaySummaryRow } from "@/types";
import { cardBaseStyle } from "@/styles";
import Button from "../ui/Button";

type ReportsDayOverviewProps = {
  userId: string;
  currency: string;
  menuItems: { id: string; name: string }[];
  isOpen: boolean;
  onToggle: () => void;
};

export default function ReportsDayOverview({
  userId,
  currency,
  menuItems,
  isOpen,
  onToggle,
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

  return (
    <section className="w-full">
      <div className="mb-8 min-h-[88px] flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Daily overview
          </h2>
          <p className="mt-2 max-w-[80%] text-sm text-muted-foreground">
            description here
          </p>
        </div>

        <Button type="button" variant="secondary" onClick={onToggle}>
          {isOpen ? "Hide" : "Show"}
        </Button>
      </div>

      <div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading daily overview…</p>
        ) : isOpen ? (
          dailySummaries.length > 0 ? (
            <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
              {dailySummaries.map((day) => (
                <div key={day.id} className={`${cardBaseStyle} p-4`}>
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
            <p className="text-sm text-muted-foreground">
              No daily summaries yet.
            </p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">Daily reports hidden.</p>
        )}
      </div>
    </section>
  );
}


/*

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
import type { DaySummary, DaySummaryRow, ReportsDayOverviewProps } from "@/types";
import { cardBaseStyle } from "@/styles";
import Button from "../ui/Button";

export default function ReportsDayOverview({
  userId,
  currency,
  menuItems,
}: ReportsDayOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [dailySummaries, setDailySummaries] = useState<DaySummaryRow[]>([]);
  const [showDailySummaries, setShowDailySummaries] = useState(false)

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
      <div className="mb-10 sm:mb-6 lg:mb-10 flex items-center justify-between">
        <div >
          <h2 className="text-2xl font-semibold tracking-tight">Daily overview</h2>
          <p className="mt-1 text-sm text-muted xl:max-w-[80%]">description here</p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowDailySummaries(prev => !prev)}
        >
          {showDailySummaries ? "Hide" : "Show"}
        </Button>
      </div>

      <div>
       {showDailySummaries ? (
        dailySummaries.length > 0 ? (
          <div className="w-full max-w-2xl space-y-3">
          {dailySummaries.map((day) => (
            <div key={day.id} className={`${cardBaseStyle} p-4 `}>
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
        )
       ) : (
       <p className="text-sm text-muted-foreground">daily reports hidden.</p>
       )}
      </div>
    </section>
  );
}



*/