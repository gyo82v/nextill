"use client";

import type { StockActivityListProps } from "@/types";
import Button from "../ui/Button";
import StockActivityCard from "./StockActivityCard";

export default function StockActivityList({
  activity,
  onDelete,
  onClearAll,
  loading
}: StockActivityListProps) {
  return (
    <section className="space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Stock activity</h3>
          <p>description here</p>
        </div>

        <Button
          type="button"
          onClick={onClearAll}
          disabled={activity.length === 0}
          loading={false}
          loadingText="clearing"
        >
          Clear all
        </Button>
      </div>

      {activity.length === 0 ? (
        <p className="opacity-70">No activity yet...</p>
      ) : (
        <ul className="space-y-2">
          {activity.map((a) => (
            <li
              key={a.id}
              className=" rounded-2xl border border-default bg-surface-1 p-4 shadow-sm"
            >
              <StockActivityCard activity={a} onDelete={onDelete} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
/*
"use client";

import type { StockActivityListProps } from "@/types";
import Button from "../ui/Button";
import StockActivityCard from "./StockActivityCard";

export default function StockActivityList({
  activity,
  onDelete,
  onClearAll,
  loading
}: StockActivityListProps) {
  return (
    <section className="space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Stock activity</h3>
          <p>description here</p>
        </div>

        <Button
          type="button"
          onClick={onClearAll}
          disabled={activity.length === 0}
          loading={false}
          loadingText="clearing"
        >
          Clear all
        </Button>
      </div>

      {activity.length === 0 ? (
        <p className="opacity-70">No activity yet.</p>
      ) : (
        <ul className="space-y-2">
          {activity.map((a) => (
            <li
              key={a.id}
              className="flex items-start justify-between gap-4 rounded border p-3 text-sm"
            >
              <div className="space-y-1">
                <div className="font-medium">{a.itemName}</div>
                <div className="opacity-80">
                  {a.action} {Math.abs(a.quantityDelta)} (
                  {a.quantityBefore} → {a.quantityAfter})
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDelete(a.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
  */