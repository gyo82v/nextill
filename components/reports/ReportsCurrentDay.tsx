"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

import type { DaySummary, ReportsCurrentDayProps } from "@/types";

import { MenuSectionDivider } from "../ui/dividers/Dividers";
import { createMenuNameById, sortItemsSales } from "@/lib/reports";

import OverviewStats from "./OverviewStats";
import TopItems from "./TopItems";
import ItemsList from "./ItemsList";

export default function ReportsCurrentDay({
  userId,
  dayKey,
  currency,
  menuItems,
}: ReportsCurrentDayProps) {
  const [loading, setLoading] = useState(true);
  const [currentDayStats, setCurrentDayStats] =
    useState<DaySummary | null>(null);

  useEffect(() => {
    if (!userId || !dayKey) {
      setCurrentDayStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const dayRef = doc(db, "users", userId, "dailySummaries", dayKey);

    const unsubscribe = onSnapshot(dayRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as DaySummary;

        setCurrentDayStats({
          date: data.date ?? dayKey,
          earnings: Number(data.earnings ?? 0),
          transactions: Number(data.transactions ?? 0),
          unitsSoldTotal: Number(data.unitsSoldTotal ?? 0),
          itemsSales: (data.itemsSales ?? {}) as Record<string, number>,
          mostSoldItem: data.mostSoldItem ?? null,
          updatedAt: data.updatedAt,
        });
      } else {
        setCurrentDayStats(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [userId, dayKey]);

  const menuNameById = createMenuNameById(menuItems);
  const currentDayItemsSorted = sortItemsSales(
    currentDayStats?.itemsSales
  );

  if (loading) {
    return <div className="p-4 opacity-70">Loading current day report…</div>;
  }

  return (
    <section className="relative w-full lg:h-[700px]">
      <div className="grid h-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-stretch">
        {/* LEFT COLUMN */}
        <div className="flex h-full min-h-0 w-full flex-col">
          <section className="mx-auto w-full max-w-2xl">
            <div className="mb-8 min-h-[88px]">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Current day
              </h1>
              <p className="mt-2 max-w-[80%] text-sm text-muted-foreground">
                description here
              </p>
            </div>

            <OverviewStats
              totalEarnings={currentDayStats?.earnings ?? 0}
              totalTransactions={currentDayStats?.transactions ?? 0}
              unitsSoldTotal={currentDayStats?.unitsSoldTotal ?? 0}
              currency={currency}
            />
          </section>

          <section className="mx-auto mt-auto w-full max-w-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-medium tracking-tight text-foreground/90">
                Top items of the day
              </h3>
            </div>

            <TopItems
              items={currentDayItemsSorted}
              menuNameById={menuNameById}
            />
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col">
          <div className="mb-8 min-h-[88px] flex flex-col justify-end">
            <h3 className="text-lg font-medium tracking-tight text-foreground/90">
              All items of the day
            </h3>
            <div className="mt-2 h-5" aria-hidden="true" />
          </div>

          <div className="min-h-0 flex-1">
            <ItemsList
              items={currentDayItemsSorted}
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
import ItemsList from "./ItemsList";
import OverviewStats from "./OverviewStats";


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

      <div className="flex flex-col w-full justify-center">

        <div className="max-w-2xl w-full mx-auto">
          <div className="mb-10 sm:mb-6 lg:mb-10">
            <h2 className="text-2xl font-semibold tracking-tight">Current day</h2>
            <p className="mt-1 text-sm text-muted xl:max-w-[80%]">description here</p>
          </div>

          <OverviewStats
            totalEarnings={currentDayStats.earnings}
            totalTransactions={currentDayStats.transactions}
            unitsSoldTotal={currentDayStats.unitsSoldTotal}
            currency={currency}
          />
        </div>

  
        <div>
          <div className="max-w-2xl w-full mx-auto">
            <h3 className="font-medium mb-4 ">Top 5 items</h3>
            <TopItems items={currentDayItemsSorted} menuNameById={menuNameById} />
          </div>
        </div>
      </div>

      <MenuSectionDivider />

   
      <div className="flex flex-col w-full justify-center">

        <div className="max-w-2xl w-full mx-auto">
          <div className="mb-10 sm:mb-6 lg:mb-10">
            <h3 className="text-lg tracking-tight">All items</h3>
            <p className="mt-1 text-sm">description here</p>
          </div>
          
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

    
        <div className="max-w-2xl w-full mx-auto">

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




*/