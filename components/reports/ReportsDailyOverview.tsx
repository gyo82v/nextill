"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import type { TransactionDoc, TransactionRow } from "@/types";
import { MenuSectionDivider } from "../ui/dividers/Dividers";
import CurrentDayTransactions from "./CurrentDayTransactions";
import ReportsDayOverview from "./ReportsDayOverview";
import { MobileDivider } from "../ui/dividers/Dividers";
import { useTranslation } from "react-i18next";
import type { ReportsDailyOverviewProp } from "@/types";

export default function ReportsDailyOverview({
  userId,
  dayKey,
  currency,
  menuItems,
}: ReportsDailyOverviewProp) {
  const [loading, setLoading] = useState(true);
  const [currentDayTransactions, setCurrentDayTransactions] = useState<
    TransactionRow[]
  >([]);
  const [showCurrentDayTransactions, setShowCurrentDayTransactions] =
    useState(false);
  const [showDailySummaries, setShowDailySummaries] = useState(false);
  const { t } = useTranslation("reports");

  useEffect(() => {
    if (!userId || !dayKey) {
      queueMicrotask(() => {
        setCurrentDayTransactions([]);
        setLoading(false);
      });
      return;
    }

    queueMicrotask(() => {
      setLoading(true);
    });

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

  const bothOpen = showCurrentDayTransactions && showDailySummaries;

  if (loading) {
    return <div className="p-4 opacity-70">{t("dailyOverview.loading")}</div>;
  }

  return (
    <section
      className={`mb-20 lg:mb-0 relative w-full ${bothOpen ? "lg:h-[700px]" : ""}`}
    >
      <div
        className={`grid h-full grid-cols-1 gap-14 lg:grid-cols-2 ${
          bothOpen ? "lg:items-stretch" : "lg:items-start"
        }`}
      >
        {/* LEFT COLUMN */}
        <div
          className={`mx-auto flex w-full max-w-2xl flex-col ${
            bothOpen ? "h-full min-h-0" : ""
          }`}
        >
          <CurrentDayTransactions
            transactions={currentDayTransactions}
            currency={currency}
            isOpen={showCurrentDayTransactions}
            onToggle={() => setShowCurrentDayTransactions((prev) => !prev)}
          />
        </div>

        <MobileDivider className="my-6" />

        {/* RIGHT COLUMN */}
        <div
          className={`mx-auto flex w-full max-w-2xl flex-col ${
            bothOpen ? "h-full min-h-0" : ""
          }`}
        >
          <ReportsDayOverview
            userId={userId}
            currency={currency}
            menuItems={menuItems}
            isOpen={showDailySummaries}
            onToggle={() => setShowDailySummaries((prev) => !prev)}
          />
        </div>
      </div>

      <MenuSectionDivider className="hidden lg:flex" />
    </section>
  );
}
