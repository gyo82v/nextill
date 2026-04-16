"use client";

import { useState } from "react";
import {
  confirmStockAdjustment,
  deleteStockItem,
  type StockItem,
} from "@/firebase/stock";

type Props = {
  uid: string;
  item: StockItem;
};

const LOW_STOCK_THRESHOLD = 5;

export default function StockItemCard({ uid, item}: Props) {
  const [delta, setDelta] = useState(0);
  const [loading, setLoading] = useState(false);

  const isLowStock = item.quantity <= LOW_STOCK_THRESHOLD;

  async function handleConfirm() {
    if (delta === 0) return;

    setLoading(true);
    await confirmStockAdjustment(uid, item.id, delta);
    setDelta(0);
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this stock item?")) return;

    setLoading(true);
    await deleteStockItem(uid, item.id);
    setLoading(false);
  }

  return (
    <div
      className={`rounded p-4 flex justify-between items-center border ${
        isLowStock ? "border-red-400 bg-red-50" : ""
      }`}
    >
      {/* Left side */}
      <div>
        <div className="font-medium flex items-center gap-2">
          {item.name}

          {isLowStock && (
            <span className="text-xs text-red-700 border border-red-300 px-2 py-0.5 rounded">
              Low stock
            </span>
          )}
        </div>

        <div className="text-sm opacity-70">
          {item.category} · {item.quantity} {item.unit}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDelta((d) => d - 1)}
          className="border rounded px-2"
        >
          −
        </button>

        <span className="min-w-[2rem] text-center">{delta}</span>

        <button
          onClick={() => setDelta((d) => d + 1)}
          className="border rounded px-2"
        >
          +
        </button>

        <button
          onClick={handleConfirm}
          disabled={loading || delta === 0}
          className="rounded bg-black text-white px-3 py-1 disabled:opacity-50"
        >
          Confirm
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}


/*
"use client";

import { useState } from "react";
import {
  confirmStockAdjustment,
  deleteStockItem,
  type StockItem,
} from "@/firebase/stock";

type Props = {
  uid: string;
  item: StockItem;
  onChange: () => void;
};

export default function StockItemCard({ uid, item, onChange }: Props) {
  const [delta, setDelta] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (delta === 0) return;

    setLoading(true);
    await confirmStockAdjustment(uid, item.id, delta);
    setDelta(0);
    setLoading(false);
    onChange();
  }

  async function handleDelete() {
    if (!confirm("Delete this stock item?")) return;

    setLoading(true);
    await deleteStockItem(uid, item.id);
    setLoading(false);
    onChange();
  }

  return (
    <div className="border rounded p-4 flex justify-between items-center">
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-sm opacity-70">
          {item.category} · {item.quantity} {item.unit}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setDelta((d) => d - 1)}
          className="border rounded px-2"
        >
          −
        </button>

        <span>{delta}</span>

        <button
          onClick={() => setDelta((d) => d + 1)}
          className="border rounded px-2"
        >
          +
        </button>

        <button
          onClick={handleConfirm}
          disabled={loading || delta === 0}
          className="rounded bg-black text-white px-3 py-1 disabled:opacity-50"
        >
          Confirm
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
*/