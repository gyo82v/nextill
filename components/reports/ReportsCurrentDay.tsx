"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatMoney } from "@/lib/money";
import type { DaySummary, TransactionDoc, TransactionRow, ReportsCurrentDayProps } from "@/types";
import { MenuSectionDivider } from "../ui/dividers/Dividers";
import { cardBaseStyle } from "@/styles";
import Button from "../ui/Button";
import { createMenuNameById, sortItemsSales } from "@/lib/reports";
import TopItems from "./TopItems";


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

  const menuNameById = createMenuNameById(menuItems);
  const currentDayItemsSorted = sortItemsSales(currentDayStats?.itemsSales);

  if (loading) {
    return <div className="p-4 opacity-70">Loading current day report…</div>;
  }

  return (
    <section className="relative grid w-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start ">
      {/*first column desktop*/}
      <div className="flex flex-col w-full justify-center">
        {/*current day overview*/}
        <div className="max-w-2xl w-full mx-auto">
          <div className="mb-10 sm:mb-6 lg:mb-10">
            <h2 className="text-2xl font-semibold tracking-tight">Current day</h2>
            <p className="mt-1 text-sm text-muted xl:max-w-[80%]">description here</p>
          </div>

          <div className={`flex justify-between w-full gap-4 py-4 px-8 ${cardBaseStyle} `}>
            <div className=" ">
              <div className="text-sm opacity-70">Earnings</div>
              <div className="text-xl font-semibold">
                {formatMoney(currentDayStats?.earnings ?? 0, currency)}
              </div>
            </div>

            <div className=" ">
              <div className="text-sm opacity-70 ">Transactions</div>
              <div className="text-xl font-semibold">
                {currentDayStats?.transactions ?? 0}
              </div>
            </div>

            <div className=" ">
              <div className="text-sm opacity-70">Units sold</div>
              <div className="text-xl font-semibold">
                {currentDayStats?.unitsSoldTotal ?? 0}
              </div>
            </div>
          </div>
        </div>

        {/*top 5 items*/}
        <div>
          <div className="max-w-2xl w-full mx-auto">
            <h3 className="font-medium mb-4 ">Top 5 items</h3>
            <TopItems items={currentDayItemsSorted} menuNameById={menuNameById} />
          </div>
        </div>
      </div>

      <MenuSectionDivider />

      {/*Second column desktop*/}
      <div className="flex flex-col w-full justify-center">
        {/*all items*/}
        <div className="max-w-2xl w-full mx-auto">
          <h3 className="font-medium mb-4">All items</h3>
          <div className={`${cardBaseStyle}  p-4`}>
            {currentDayItemsSorted.map(([id, qty]) => (
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

        {/*Current day transactions*/}
        <div className="max-w-2xl w-full mx-auto">
          {/*current day transactions header*/}
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-medium">Current day transactions</h2>

            <Button
              type="button"
              onClick={() => setShowCurrentDayTransactions((prev) => !prev)}
              variant="secondary"
            >
              {showCurrentDayTransactions ? "Hide" : "Show"}
            </Button>
          </div>

          {/*current day transaciton list*/}
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
        </div>
      </div>
    </section>
  );
}