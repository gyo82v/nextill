"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { listMenuItems, type MenuItem } from "@/firebase/menu";
import { formatMoney } from "@/lib/money";

/* ---------- Types ---------- */

type GlobalStats = {
  totalEarnings: number;
  totalTransactions: number;
  unitsSoldTotal: number;
  itemsSales: Record<string, number>;
  lastSaleAt?: unknown;
};

type DaySummary = {
  date: string;
  earnings: number;
  transactions: number;
  unitsSoldTotal?: number;
  itemsSales?: Record<string, number>;
  mostSoldItem?: string | null;
  updatedAt?: unknown;
};

type DaySummaryRow = DaySummary & {
  id: string;
};

type TransactionItem = {
  menuId: string;
  name: string;
  quantity: number;
  priceMinor: number;
};

type TransactionDoc = {
  createdAt?: unknown;
  dayKey: string;
  totalMinor: number;
  itemCount: number;
  status: string;
  items: TransactionItem[];
};

type TransactionRow = TransactionDoc & {
  id: string;
};

/* ---------- Component ---------- */

export default function StatisticsPage() {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalEarnings: 0,
    totalTransactions: 0,
    unitsSoldTotal: 0,
    itemsSales: {},
  });
  const [currentDayStats, setCurrentDayStats] = useState<DaySummary | null>(
    null
  );
  const [dailySummaries, setDailySummaries] = useState<DaySummaryRow[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentDayTransactions, setCurrentDayTransactions] = useState<
    TransactionRow[]
  >([]);
  const [showCurrentDayTransactions, setShowCurrentDayTransactions] =
    useState(false);

  const dayKey = profile?.nextillApp?.dayCycle?.dayKey ?? null;
  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";

  useEffect(() => {
    async function load() {
      if (!user) return;

      setLoading(true);

      try {
        const userRef = doc(db, "users", user.uid);
        const dayRef = dayKey
          ? doc(db, "users", user.uid, "dailySummaries", dayKey)
          : null;
        const transactionsRef = dayKey
          ? collection(
              db,
              "users",
              user.uid,
              "dailySummaries",
              dayKey,
              "transactions"
            )
          : null;

        const [userSnap, daySnap, summariesSnap, menus, transactionsSnap] =
          await Promise.all([
            getDoc(userRef),
            dayRef ? getDoc(dayRef) : Promise.resolve(null),
            getDocs(
              query(
                collection(db, "users", user.uid, "dailySummaries"),
                orderBy("date", "desc")
              )
            ),
            listMenuItems(user.uid),
            transactionsRef
              ? getDocs(query(transactionsRef, orderBy("createdAt", "desc")))
              : Promise.resolve(null),
          ]);

        const stats = userSnap.exists()
          ? (userSnap.data()?.nextillApp?.statistics ?? {})
          : {};

        setGlobalStats({
          totalEarnings: Number(stats.totalEarnings ?? 0),
          totalTransactions: Number(stats.totalTransactions ?? 0),
          unitsSoldTotal: Number(stats.unitsSoldTotal ?? 0),
          itemsSales: (stats.itemsSales ?? {}) as Record<string, number>,
          lastSaleAt: stats.lastSaleAt,
        });

        if (daySnap && daySnap.exists()) {
          const dayData = daySnap.data() as DaySummary;
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

        setDailySummaries(
          summariesSnap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as DaySummary),
          }))
        );

        setMenuItems(menus);

        setCurrentDayTransactions(
          transactionsSnap
            ? transactionsSnap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as TransactionDoc),
              }))
            : []
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, dayKey]);

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

  const currentDayItemsSorted = useMemo(() => {
    return currentDayStats?.itemsSales
      ? Object.entries(currentDayStats.itemsSales).sort((a, b) => b[1] - a[1])
      : [];
  }, [currentDayStats]);

  if (!user) return null;
  if (loading) return <div className="p-6 opacity-70">Loading…</div>;

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Statistics</h1>

      {/* ---------- GLOBAL OVERVIEW ---------- */}
      <section className="space-y-3">
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
            <div className="text-xl font-semibold">
              {globalStats.unitsSoldTotal}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- GLOBAL ITEMS ---------- */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium">Global item sales</h2>

        {/* Top 5 */}
        <div className="space-y-2">
          <h3 className="font-medium">Top 5 items</h3>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {globalItemsSorted.slice(0, 5).map(([id, qty], i) => (
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

        {/* All items */}
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
      </section>

      {/* ---------- CURRENT DAY ITEMS ---------- */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium">Current day item sales</h2>

        {/* Top 5 */}
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

        {/* All items */}
        <div className="space-y-2">
          <h3 className="font-medium">All items</h3>
          <div className="space-y-2">
            {currentDayItemsSorted.map(([id, qty]) => (
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
      </section>
      {/* current day transactions  */}

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
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-sm opacity-70">Transaction ID</div>
                      <div className="font-medium break-all">{tx.id}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm opacity-70">Item count</div>
                      <div className="font-medium">{tx.itemCount}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm opacity-70">Total</div>
                      <div className="font-medium">
                        {formatMoney(tx.totalMinor, currency)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Items</div>
                    <div className="space-y-2">
                      {tx.items.map((item, index) => (
                        <div
                          key={`${tx.id}-${item.menuId}-${index}`}
                          className="rounded bg-muted/40 px-3 py-2 text-sm"
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="opacity-70">
                            Qty: {item.quantity} · Unit price:{" "}
                            {formatMoney(item.priceMinor, currency)} · Line total:{" "}
                            {formatMoney(item.priceMinor * item.quantity, currency)}
                          </div>
                        </div>
                      ))}
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

      {/* day overview */}

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
    </div>
  );
}

/*

"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { listMenuItems, type MenuItem } from "@/firebase/menu";

type GlobalStats = {
  totalEarnings: number;
  totalTransactions: number;
  unitsSoldTotal: number;
  itemsSales: Record<string, number>;
  lastSaleAt?: unknown;
};

type DaySummary = {
  date: string;
  earnings: number;
  transactions: number;
  unitsSoldTotal?: number;
  itemsSales?: Record<string, number>;
  mostSoldItem?: string | null;
  updatedAt?: unknown;
};

type DaySummaryRow = DaySummary & {
  id: string;
};

export default function StatisticsPage() {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalEarnings: 0,
    totalTransactions: 0,
    unitsSoldTotal: 0,
    itemsSales: {},
  });
  const [currentDayStats, setCurrentDayStats] = useState<DaySummary | null>(null);
  const [dailySummaries, setDailySummaries] = useState<DaySummaryRow[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const dayKey = profile?.nextillApp?.dayCycle?.dayKey ?? null;
  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";

  useEffect(() => {
    async function load() {
      if (!user) return;

      setLoading(true);

      try {
        const userRef = doc(db, "users", user.uid);
        const dayRef = dayKey
          ? doc(db, "users", user.uid, "dailySummaries", dayKey)
          : null;

        const [userSnap, daySnap, summariesSnap, menus] = await Promise.all([
          getDoc(userRef),
          dayRef ? getDoc(dayRef) : Promise.resolve(null),
          getDocs(
            query(
              collection(db, "users", user.uid, "dailySummaries"),
              orderBy("date", "desc")
            )
          ),
          listMenuItems(user.uid),
        ]);

        const stats = userSnap.exists()
          ? (userSnap.data()?.nextillApp?.statistics ?? {})
          : {};

        setGlobalStats({
          totalEarnings: Number(stats.totalEarnings ?? 0),
          totalTransactions: Number(stats.totalTransactions ?? 0),
          unitsSoldTotal: Number(stats.unitsSoldTotal ?? 0),
          itemsSales: (stats.itemsSales ?? {}) as Record<string, number>,
          lastSaleAt: stats.lastSaleAt,
        });

        if (daySnap && daySnap.exists()) {
          const dayData = daySnap.data() as DaySummary;
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

        const summaryRows: DaySummaryRow[] = summariesSnap.docs.map((d) => {
          const data = d.data() as DaySummary;
          return {
            id: d.id,
            date: data.date ?? d.id,
            earnings: Number(data.earnings ?? 0),
            transactions: Number(data.transactions ?? 0),
            unitsSoldTotal: Number(data.unitsSoldTotal ?? 0),
            itemsSales: (data.itemsSales ?? {}) as Record<string, number>,
            mostSoldItem: data.mostSoldItem ?? null,
            updatedAt: data.updatedAt,
          };
        });

        setDailySummaries(summaryRows);
        setMenuItems(menus);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, dayKey]);

  const menuNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of menuItems) {
      map.set(item.id, item.name);
    }
    return map;
  }, [menuItems]);

  const globalTopItems = useMemo(() => {
    return Object.entries(globalStats.itemsSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [globalStats.itemsSales]);

  if (!user) return null;

  if (loading) {
    return <div className="p-6 opacity-70">Loading statistics…</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Statistics</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Global overview</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded border p-4">
            <div className="text-sm opacity-70">Total earnings</div>
            <div className="text-xl font-semibold">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency,
              }).format(globalStats.totalEarnings / 100)}
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
            <div className="text-xl font-semibold">
              {globalStats.unitsSoldTotal}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Current day</h2>

        {dayKey ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded border p-4">
              <div className="text-sm opacity-70">Day earnings</div>
              <div className="text-xl font-semibold">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency,
                }).format((currentDayStats?.earnings ?? 0) / 100)}
              </div>
            </div>

            <div className="rounded border p-4">
              <div className="text-sm opacity-70">Day transactions</div>
              <div className="text-xl font-semibold">
                {currentDayStats?.transactions ?? 0}
              </div>
            </div>

            <div className="rounded border p-4">
              <div className="text-sm opacity-70">Units sold today</div>
              <div className="text-xl font-semibold">
                {currentDayStats?.unitsSoldTotal ?? 0}
              </div>
            </div>
          </div>
        ) : (
          <p className="opacity-70">No active day selected.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Current day item sales</h2>

        {currentDayStats?.itemsSales &&
        Object.keys(currentDayStats.itemsSales).length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(currentDayStats.itemsSales)
              .sort((a, b) => b[1] - a[1])
              .map(([menuId, qty]) => (
                <div key={menuId} className="rounded border p-4">
                  <div className="font-medium">
                    {menuNameById.get(menuId) ?? menuId}
                  </div>
                  <div className="text-sm opacity-70">Sold: {qty}</div>
                </div>
              ))}
          </div>
        ) : (
          <p className="opacity-70">No item sales for the current day yet.</p>
        )}
      </section>


      <section className="space-y-3">
        <h2 className="text-lg font-medium">Top 5 items sold</h2>

        {globalTopItems.length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {globalTopItems.map(([menuId, qty], index) => (
              <div key={menuId} className="rounded border p-4">
                <div className="text-sm opacity-70">#{index + 1}</div>
                <div className="font-medium">
                  {menuNameById.get(menuId) ?? menuId}
                </div>
                <div className="text-sm opacity-70">Sold: {qty}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="opacity-70">No sales yet.</p>
        )}
      </section>


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
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency,
                      }).format(day.earnings / 100)}
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
    </div>
  );
}







*/