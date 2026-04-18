"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import {
  subscribeStockItems,
  subscribeStockActivity,
  deleteStockActivity,
  clearStockActivity,
  type StockItem,
  type StockActivity,
} from "@/firebase/stock";
import AddStockItemForm from "@/components/stock/AddStockItemForm";
import StockList from "@/components/stock/StockList";
import StockActivityList from "@/components/stock/StockActivityList";

export default function StockPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<StockItem[]>([]);
  const [activity, setActivity] = useState<StockActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const unsubItems = subscribeStockItems(user.uid, (items) => {
      setItems(items);
      setLoading(false);
    });

    const unsubActivity = subscribeStockActivity(user.uid, (activity) => {
      setActivity(activity);
    });

    return () => {
      unsubItems();
      unsubActivity();
    };
  }, [user]);

  async function handleDeleteActivity(id: string) {
    if (!user) return;
    await deleteStockActivity(user.uid, id);
    // no reload needed 🎉
  }

  async function handleClearActivity() {
    if (!user) return;
    if (!confirm("Clear all stock activity?")) return;
    await clearStockActivity(user.uid);
    // no reload needed 🎉
  }

  if (!user) return null;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Stock</h1>

      <AddStockItemForm uid={user.uid} />

      {loading ? (
        <p className="opacity-70">Loading stock…</p>
      ) : (
        <>
          <StockList uid={user.uid} items={items} />
          <StockActivityList
            activity={activity}
            onDelete={handleDeleteActivity}
            onClearAll={handleClearActivity}
          />
        </>
      )}
    </div>
  );
}

