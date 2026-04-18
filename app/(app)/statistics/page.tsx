"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

type GlobalStats = {
  totalEarnings?: number;
  totalTransactionsNumber?: number;
};

type DaySummary = {
  earnings?: number;
  transactions?: number;
};

export default function StatisticsPage() {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);

  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [dayStats, setDayStats] = useState<DaySummary | null>(null);

  const dayKey = profile?.nextillApp?.dayCycle?.dayKey ?? null;

  useEffect(() => {
    async function load() {
      if (!user || !dayKey) return;

      setLoading(true);

      try {
        const userRef = doc(db, "users", user.uid);
        const dayRef = doc(db, "users", user.uid, "dailySummaries", dayKey);

        const [userSnap, daySnap] = await Promise.all([
          getDoc(userRef),
          getDoc(dayRef),
        ]);

        const userData = userSnap.exists()
          ? userSnap.data()?.nextillApp?.statistics
          : null;

        const dayData = daySnap.exists() ? daySnap.data() : null;

        setGlobalStats({
          totalEarnings: userData?.totalEarnings ?? 0,
          totalTransactionsNumber: userData?.totalTransactionsNumber ?? 0,
        });

        setDayStats({
          earnings: dayData?.earnings ?? 0,
          transactions: dayData?.transactions ?? 0,
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, dayKey]);

  if (!user) return null;

  if (loading) {
    return <div className="p-6 opacity-70">Loading statistics…</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Statistics</h1>

      {/* GLOBAL STATS */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded border p-4">
          <div className="text-sm opacity-70">Total earnings</div>
          <div className="text-xl font-semibold">
            {globalStats?.totalEarnings ?? 0}
          </div>
        </div>

        <div className="rounded border p-4">
          <div className="text-sm opacity-70">Total transactions</div>
          <div className="text-xl font-semibold">
            {globalStats?.totalTransactionsNumber ?? 0}
          </div>
        </div>
      </div>

      {/* CURRENT DAY STATS */}
      <div>
        <h2 className="text-lg font-medium mb-3">Current day</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded border p-4">
            <div className="text-sm opacity-70">Day earnings</div>
            <div className="text-xl font-semibold">
              {dayStats?.earnings ?? 0}
            </div>
          </div>

          <div className="rounded border p-4">
            <div className="text-sm opacity-70">Day transactions</div>
            <div className="text-xl font-semibold">
              {dayStats?.transactions ?? 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}