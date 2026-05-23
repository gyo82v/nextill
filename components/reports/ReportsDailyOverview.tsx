"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import type { TransactionDoc, TransactionRow } from "@/types";
import { MenuSectionDivider } from "../ui/dividers/Dividers";
import CurrentDayTransactions from "./CurrentDayTransactions";
import ReportsDayOverview from "./ReportsDayOverview";

type ReportsDailyOverviewProps = {
  userId: string;
  dayKey: string | null;
  currency: string;
  menuItems: { id: string; name: string }[];
};

export default function ReportsDailyOverview({
  userId,
  dayKey,
  currency,
  menuItems,
}: ReportsDailyOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [currentDayTransactions, setCurrentDayTransactions] = useState<
    TransactionRow[]
  >([]);

  useEffect(() => {
    if (!userId || !dayKey) {
      setCurrentDayTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const transactionsRef = collection(
      db,
      "users",
      userId,
      "dailySummaries",
      dayKey,
      "transactions"
    );

    const unsubscribeTransactions = onSnapshot(
      query(transactionsRef, orderBy("createdAt", "desc")),
      (snap) => {
        setCurrentDayTransactions(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as TransactionDoc),
          }))
        );

        setLoading(false);
      },
      () => {
        setCurrentDayTransactions([]);
        setLoading(false);
      }
    );

    return unsubscribeTransactions;
  }, [userId, dayKey]);

  if (loading) {
    return <div className="p-4 opacity-70">Loading daily overview…</div>;
  }

  return (
    <section className="relative w-full lg:h-[700px]">
      <div className="grid h-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-stretch">
        {/* LEFT COLUMN */}
        <div className="flex h-full min-h-0 w-full flex-col">
          <section className="mx-auto w-full max-w-2xl">
            <CurrentDayTransactions
              transactions={currentDayTransactions}
              currency={currency}
            />
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col">
          <div className="min-h-0 flex-1">
            <ReportsDayOverview
              userId={userId}
              currency={currency}
              menuItems={menuItems}
            />
          </div>
        </div>
      </div>

      <MenuSectionDivider />
    </section>
  );
}