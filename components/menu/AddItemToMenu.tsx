"use client";

import type { MenuCategory } from "@/firebase/menu";
import type { StockItem } from "@/firebase/stock";

export type IngredientRow = {
  stockId: string;
  quantity: number;
};

type Props = {
  currency: string;
  stockItems: StockItem[];
  name: string;
  setName: (value: string) => void;
  priceDisplay: string;
  setPriceDisplay: (value: string) => void;
  category: MenuCategory;
  setCategory: (value: MenuCategory) => void;
  ingredientRows: IngredientRow[];
  addIngredientRow: () => void;
  updateIngredientRow: (index: number, patch: Partial<IngredientRow>) => void;
  removeIngredientRow: (index: number) => void;
  onSave: () => void;
};

export default function AddItemToMenu({
  currency,
  stockItems,
  name,
  setName,
  priceDisplay,
  setPriceDisplay,
  category,
  setCategory,
  ingredientRows,
  addIngredientRow,
  updateIngredientRow,
  removeIngredientRow,
  onSave,
}: Props) {
  return (
    <div className="rounded-2xl border border-default bg-surface-1 p-4 shadow-sm sm:p-5 md:p-6">
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Add item
        </h2>
        <p className="text-sm text-muted">
          Select name, price, category and optionally ingredients.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className="h-11 rounded-xl border border-default bg-surface-1 px-3.5 text-sm text-[var(--foreground)] outline-none transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out placeholder:text-[var(--muted-foreground)] hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="h-11 rounded-xl border border-default bg-surface-1 px-3.5 text-sm text-[var(--foreground)] outline-none transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out placeholder:text-[var(--muted-foreground)] hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          type="number"
          step="0.01"
          min="0"
          placeholder={`Price (${currency})`}
          value={priceDisplay}
          onChange={(e) => setPriceDisplay(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <select
          className="h-11 w-full rounded-xl border border-default bg-surface-1 px-3.5 text-sm text-[var(--foreground)] outline-none transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          value={category}
          onChange={(e) => setCategory(e.target.value as MenuCategory)}
        >
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-medium text-[var(--foreground)]">
              Ingredients (optional)
            </h3>
            <p className="text-sm text-muted">
              Link stock items to keep menu and inventory connected.
            </p>
          </div>

          <button
            type="button"
            onClick={addIngredientRow}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-default bg-surface-2 px-4 text-sm font-medium text-[var(--foreground)] shadow-sm transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out hover:bg-surface-1 active:scale-[0.98] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          >
            Add ingredient
          </button>
        </div>

        {ingredientRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-default bg-surface-2 px-4 py-3 text-sm text-muted">
            No ingredients selected. This item will not interact with stock.
          </div>
        ) : (
          <div className="space-y-3">
            {ingredientRows.map((row, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-2xl border border-default bg-surface-1 p-3 shadow-sm md:grid-cols-[minmax(0,1fr),120px,auto]"
              >
                <select
                  className="h-11 w-full rounded-xl border border-default bg-surface-1 px-3.5 text-sm text-[var(--foreground)] outline-none transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
                  value={row.stockId}
                  onChange={(e) =>
                    updateIngredientRow(index, { stockId: e.target.value })
                  }
                >
                  <option value="">Select stock item</option>
                  {stockItems.map((stock) => (
                    <option key={stock.id} value={stock.id}>
                      {stock.name} ({stock.quantity} {stock.unit})
                    </option>
                  ))}
                </select>

                <input
                  className="h-11 w-full rounded-xl border border-default bg-surface-1 px-3.5 text-sm text-[var(--foreground)] outline-none transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out placeholder:text-[var(--muted-foreground)] hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) =>
                    updateIngredientRow(index, {
                      quantity: Number(e.target.value),
                    })
                  }
                />

                <button
                  type="button"
                  onClick={() => removeIngredientRow(index)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-default bg-surface-2 px-4 text-sm font-medium text-red-600 transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out hover:bg-red-600 hover:text-white active:scale-[0.98] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] md:w-full"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onSave}
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-out hover:bg-[var(--primary-hover)] active:scale-[0.98] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
      >
        Save menu item
      </button>
    </div>
  );
}


/*


"use client";

import type { MenuCategory } from "@/firebase/menu";
import type { StockItem } from "@/firebase/stock";

export type IngredientRow = {
  stockId: string;
  quantity: number;
};

type Props = {
  currency: string;
  stockItems: StockItem[];
  name: string;
  setName: (value: string) => void;
  priceDisplay: string;
  setPriceDisplay: (value: string) => void;
  category: MenuCategory;
  setCategory: (value: MenuCategory) => void;
  ingredientRows: IngredientRow[];
  addIngredientRow: () => void;
  updateIngredientRow: (index: number, patch: Partial<IngredientRow>) => void;
  removeIngredientRow: (index: number) => void;
  onSave: () => void;
};

export default function AddItemToMenu({
  currency,
  stockItems,
  name,
  setName,
  priceDisplay,
  setPriceDisplay,
  category,
  setCategory,
  ingredientRows,
  addIngredientRow,
  updateIngredientRow,
  removeIngredientRow,
  onSave,
}: Props) {
  return (
    <div className="max-w-2xl rounded border p-4 space-y-4">
      <h2 className="text-lg font-medium">Add menu item</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded border px-3 py-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="rounded border px-3 py-2"
          type="number"
          step="0.01"
          min="0"
          placeholder={`Price (${currency})`}
          value={priceDisplay}
          onChange={(e) => setPriceDisplay(e.target.value)}
        />
      </div>

      <select
        className="rounded border px-3 py-2"
        value={category}
        onChange={(e) => setCategory(e.target.value as MenuCategory)}
      >
        <option value="food">Food</option>
        <option value="drink">Drink</option>
      </select>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Ingredients (optional)</h3>

          <button
            type="button"
            onClick={addIngredientRow}
            className="rounded border px-3 py-2 text-sm"
          >
            Add ingredient
          </button>
        </div>

        {ingredientRows.length === 0 ? (
          <p className="text-sm opacity-70">
            No ingredients selected. This item will not interact with stock.
          </p>
        ) : (
          <div className="space-y-2">
            {ingredientRows.map((row, index) => (
              <div
                key={index}
                className="grid gap-2 md:grid-cols-[1fr,120px,auto]"
              >
                <select
                  className="rounded border px-3 py-2"
                  value={row.stockId}
                  onChange={(e) =>
                    updateIngredientRow(index, { stockId: e.target.value })
                  }
                >
                  <option value="">Select stock item</option>
                  {stockItems.map((stock) => (
                    <option key={stock.id} value={stock.id}>
                      {stock.name} ({stock.quantity} {stock.unit})
                    </option>
                  ))}
                </select>

                <input
                  className="rounded border px-3 py-2"
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) =>
                    updateIngredientRow(index, {
                      quantity: Number(e.target.value),
                    })
                  }
                />

                <button
                  type="button"
                  onClick={() => removeIngredientRow(index)}
                  className="rounded border px-3 py-2 text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onSave}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Save menu item
      </button>
    </div>
  );
}





*/