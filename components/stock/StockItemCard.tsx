"use client";

import { useState } from "react";
import {
  confirmStockAdjustment,
  archiveStockItem,
  updateStockMinQty,
  type StockItem,
} from "@/firebase/stock";

type Props = {
  uid: string;
  item: StockItem;
};

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export default function StockItemCard({ uid, item }: Props) {
  const [delta, setDelta] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [minQtyDraft, setMinQtyDraft] = useState(
    item.minQty ?? DEFAULT_LOW_STOCK_THRESHOLD
  );
  const [savingThreshold, setSavingThreshold] = useState(false);

  const lowStockThreshold = item.minQty ?? DEFAULT_LOW_STOCK_THRESHOLD;

  const isNegativeStock = item.quantity < 0;
  const isLowStock = item.quantity >= 0 && item.quantity <= lowStockThreshold;
  const isNormalStock = item.quantity > lowStockThreshold;

  const statusClass = isNegativeStock
    ? "border-red-500 bg-red-50"
    : isLowStock
      ? "border-yellow-400 bg-yellow-50"
      : "border-green-400 bg-green-50";

  const statusBadgeClass = isNegativeStock
    ? "text-red-700 border-red-300"
    : isLowStock
      ? "text-yellow-800 border-yellow-300"
      : "text-green-700 border-green-300";

  const statusLabel = isNegativeStock
    ? "Negative stock"
    : isLowStock
      ? "Low stock"
      : "In stock";

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
    await archiveStockItem(uid, item.id);
    setLoading(false);
  }

  async function handleSaveThreshold() {
    setSavingThreshold(true);
    await updateStockMinQty(uid, item.id, minQtyDraft);
    setSavingThreshold(false);
    setIsEditingThreshold(false);
  }

  function handleCancelThresholdEdit() {
    setMinQtyDraft(item.minQty ?? DEFAULT_LOW_STOCK_THRESHOLD);
    setIsEditingThreshold(false);
  }

  return (
    <div className={`rounded p-4 flex justify-between items-center border ${statusClass}`}>
      <div className="space-y-2">
        <div className="font-medium flex items-center gap-2">
          {item.name}

          <span className={`text-xs border px-2 py-0.5 rounded ${statusBadgeClass}`}>
            {statusLabel}
          </span>
        </div>

        <div className="text-sm opacity-70">
          {item.category} · {item.quantity} {item.unit}
        </div>

        <div className="text-sm opacity-70 flex items-center gap-2">
          <span>Low stock threshold: {lowStockThreshold}</span>

          <button
            type="button"
            onClick={() => setIsEditingThreshold((prev) => !prev)}
            className="text-xs underline"
          >
            Edit
          </button>
        </div>

        {isEditingThreshold && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={minQtyDraft}
              onChange={(e) => setMinQtyDraft(Number(e.target.value))}
              className="w-24 rounded border px-2 py-1 text-sm"
            />

            <button
              type="button"
              onClick={handleSaveThreshold}
              disabled={savingThreshold}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Save
            </button>

            <button
              type="button"
              onClick={handleCancelThresholdEdit}
              className="rounded border px-3 py-1 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

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
};

const DEFAULT_LOW_STOCK_THRESHOLD = 10;

export default function StockItemCard({ uid, item }: Props) {
  const [delta, setDelta] = useState(0);
  const [loading, setLoading] = useState(false);

  const lowStockThreshold = item.minQty ?? DEFAULT_LOW_STOCK_THRESHOLD;

  const isNegativeStock = item.quantity < 0;
  const isLowStock = item.quantity >= 0 && item.quantity <= lowStockThreshold;
  const isNormalStock = item.quantity > lowStockThreshold;

  const statusClass = isNegativeStock
    ? "border-red-500 bg-red-50"
    : isLowStock
      ? "border-yellow-400 bg-yellow-50"
      : "border-green-400 bg-green-50";

  const statusBadgeClass = isNegativeStock
    ? "text-red-700 border-red-300"
    : isLowStock
      ? "text-yellow-800 border-yellow-300"
      : "text-green-700 border-green-300";

  const statusLabel = isNegativeStock
    ? "Negative stock"
    : isLowStock
      ? "Low stock"
      : "In stock";

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
    <div className={`rounded p-4 flex justify-between items-center border ${statusClass}`}>
      <div>
        <div className="font-medium flex items-center gap-2">
          {item.name}

          <span className={`text-xs border px-2 py-0.5 rounded ${statusBadgeClass}`}>
            {statusLabel}
          </span>
        </div>

        <div className="text-sm opacity-70">
          {item.category} · {item.quantity} {item.unit}
          {" · "}
          threshold: {lowStockThreshold}
        </div>
      </div>

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








*/

