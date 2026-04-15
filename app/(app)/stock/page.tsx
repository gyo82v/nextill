"use client";

import { use, useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import {
  listStockItems,
  listStockActivity,
  createStockItem,
  adjustStockQty,
  deleteStockItem,
} from "@/firebase/stock";
import type { StockItem, StockActivity } from "@/types/nextill";

export default function StockPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<StockItem[]>([]);
  const [activity, setActivity] = useState<StockActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [qty, setQty] = useState(0);
  const [unit, setUnit] = useState<"pcs" | "g" | "kg" | "ml" | "l">("pcs");

  async function load() {
    if (!user) return;
    setLoading(true);
    const [stock, log] = await Promise.all([
      listStockItems(user.uid),
      listStockActivity(user.uid),
    ]);
    setItems(stock);
    setActivity(log);
    setLoading(false);
  }

  useEffect(() => {
  if (!user) return;

  let ignore = false;

  async function fetchData() {
    if(!user) return;
    setLoading(true);

    const [stock, log] = await Promise.all([
      listStockItems(user.uid),
      listStockActivity(user.uid),
    ]);

    if (ignore) return;

    setItems(stock);
    setActivity(log);
    setLoading(false);
  }

  fetchData();

  return () => {
    ignore = true;
  };
}, [user]);

  async function handleAddStock() {
    if (!user || !name || qty <= 0) return;

    await createStockItem(user.uid, {
      name,
      qty,
      unit,
      isActive: true,
    });

    setName("");
    setQty(0);
    await load();
  }

  async function handleAdjust(item: StockItem, delta: number) {
    if (!user) return;

    await adjustStockQty(
      user.uid,
      item.id,
      item.name,
      item.qty,
      delta
    );

    await load();
  }

  async function handleDelete(item: StockItem) {
    if (!user) return;

    if (!confirm(`Delete ${item.name}?`)) return;

    await deleteStockItem(user.uid, item.id, item.name, item.qty);
    await load();
  }

  if (!user) {
    return <p className="p-6">Please log in</p>;
  }

  if (loading) {
    return <p className="p-6">Loading stock…</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {/* Stock list */}
      <div className="col-span-2 space-y-4">
        <h1 className="text-2xl font-semibold">Stock</h1>

        {items.length === 0 && (
          <p className="text-sm opacity-70">No stock items</p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded border p-3"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm opacity-70">
                {item.qty} {item.unit}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAdjust(item, -1)}
                className="rounded border px-2"
              >
                −
              </button>
              <button
                onClick={() => handleAdjust(item, 1)}
                className="rounded border px-2"
              >
                +
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="rounded border px-2 text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Add stock */}
        <div className="rounded border p-4 space-y-3">
          <h2 className="font-semibold">Add stock item</h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded border px-3 py-2"
          />

          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            placeholder="Quantity"
            className="w-full rounded border px-3 py-2"
          />

          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as StockItem["unit"])}
            className="w-full rounded border px-3 py-2"
          >
            <option value="pcs">pcs</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
          </select>

          <button
            onClick={handleAddStock}
            className="w-full rounded bg-black text-white px-4 py-2"
          >
            Add
          </button>
        </div>

        {/* Activity log */}
        <div className="rounded border p-4 space-y-3">
          <h2 className="font-semibold">Stock activity</h2>

          {activity.length === 0 && (
            <p className="text-sm opacity-70">No activity yet</p>
          )}

          {activity.slice(0, 10).map((a) => (
            <div key={a.id} className="text-sm">
              <div>
                <strong>{a.stockName}</strong> {a.type} ({a.deltaQty})
              </div>
              <div className="opacity-60">
                {a.beforeQty} → {a.afterQty}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
