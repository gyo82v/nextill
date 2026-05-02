"use client";

import { FiTrash2 } from "react-icons/fi";
import { formatMoney } from "@/lib/money";
import type { StockItem } from "@/firebase/stock";
import type { MenuItem as MenuItemData } from "@/firebase/menu";
import { cardBaseStyle } from "@/styles/cards";

type Props = {
  item: MenuItemData;
  stockItems: StockItem[];
  currency: string;
  onDelete: (menuId: string) => void;
};

export default function MenuItem({
  item,
  stockItems,
  currency,
  onDelete,
}: Props) {
  return (
    <div className={`${cardBaseStyle} p-4 md:p-5`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="font-medium text-[var(--foreground)]">{item.name}</div>
          <div className="mt-1 text-sm text-muted">
            {formatMoney(item.priceMinor, currency)} · {item.category}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          aria-label={`Delete ${item.name}`}
          title={`Delete ${item.name}`}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-default bg-surface-2 text-muted transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out hover:bg-red-600 hover:text-white active:scale-[0.98] active:translate-y-px active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-[color:var(--background)] motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:transform-none"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="my-4 h-px bg-[var(--divider)] opacity-60" />

      {item.ingredients.length > 0 ? (
        <div className="text-sm text-muted">
          <span className="font-medium text-[var(--foreground)]">Ingredients:</span>{" "}
          {item.ingredients
            .map((ing) => {
              const stock = stockItems.find((s) => s.id === ing.stockId);
              return stock
                ? `${stock.name} × ${ing.quantity}`
                : `${ing.stockId} × ${ing.quantity}`;
            })
            .join(", ")}
        </div>
      ) : (
        <div className="text-sm text-muted">No ingredients linked</div>
      )}
    </div>
  );
}