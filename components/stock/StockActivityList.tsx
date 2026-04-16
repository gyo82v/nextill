"use client";

import type { StockActivity } from "@/firebase/stock";

type Props = {
  activity: StockActivity[];
  onDelete: (activityId: string) => void;
  onClearAll: () => void;
};

export default function StockActivityList({
  activity,
  onDelete,
  onClearAll,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium">Stock activity</h2>

        <button
          type="button"
          onClick={onClearAll}
          disabled={activity.length === 0}
          className="rounded border px-3 py-2 text-sm text-red-600 disabled:opacity-50"
        >
          Clear all
        </button>
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
    </div>
  );
}
/*
"use client";

import type { StockActivity } from "@/firebase/stock";

type Props = {
  activity: StockActivity[];
};

export default function StockActivityList({ activity }: Props) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">Stock activity</h2>

      {activity.length === 0 ? (
        <p className="opacity-70">No activity yet.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {activity.map((a) => (
            <li key={a.id} className="opacity-80">
              {a.itemName} — {a.action} {Math.abs(a.quantityDelta)} (
              {a.quantityBefore} → {a.quantityAfter})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
  */