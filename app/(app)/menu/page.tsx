"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { formatMoney } from "@/lib/money";
import { listStockItems, type StockItem } from "@/firebase/stock";
import {
  createMenuItem,
  deleteMenuItem,
  listMenuItems,
  type MenuCategory,
  type MenuIngredient,
  type MenuItem,
} from "@/firebase/menu";

type IngredientRow = {
  stockId: string;
  quantity: number;
};

export default function MenuPage() {
  const { user, profile } = useAuth();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");
  const [category, setCategory] = useState<MenuCategory>("food");
  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([]);

  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";

  const load = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const [menus, stock] = await Promise.all([
      listMenuItems(user.uid),
      listStockItems(user.uid),
    ]);

    const safeMenus = menus.map((item) => ({
      ...item,
      ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
    }));

    // ✅ ONLY CHANGE: remove archived stock items
    const activeStockItems = stock.filter((item) => item.active !== false);

    setMenuItems(safeMenus);
    setStockItems(activeStockItems);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) return null;

  function addIngredientRow() {
    setIngredientRows((prev) => [...prev, { stockId: "", quantity: 1 }]);
  }

  function updateIngredientRow(index: number, patch: Partial<IngredientRow>) {
    setIngredientRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  }

  function removeIngredientRow(index: number) {
    setIngredientRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCreateMenuItem() {
    if (!name.trim()) return;

    const price = Number(priceDisplay);
    if (!Number.isFinite(price) || price <= 0) return;

    const priceMinor = Math.round(price * 100);

    const ingredients: MenuIngredient[] = ingredientRows
      .filter((row) => row.stockId && row.quantity > 0)
      .map((row) => ({
        stockId: row.stockId,
        quantity: row.quantity,
      }));

    await createMenuItem(user.uid, {
      name,
      priceMinor,
      category,
      ingredients,
    });

    setName("");
    setPriceDisplay("");
    setCategory("food");
    setIngredientRows([]);
    await load();
  }

  async function handleDelete(menuId: string) {
    if (!confirm("Delete this menu item?")) return;
    await deleteMenuItem(user.uid, menuId);
    await load();
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Menu</h1>

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
          onClick={handleCreateMenuItem}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Save menu item
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Current menu</h2>

        {loading ? (
          <p className="opacity-70">Loading…</p>
        ) : menuItems.length === 0 ? (
          <p className="opacity-70">No menu items.</p>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div key={item.id} className="rounded border p-4 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm opacity-70">
                      {formatMoney(item.priceMinor, currency)} · {item.category}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>

                {item.ingredients.length > 0 ? (
                  <div className="text-sm opacity-80">
                    Ingredients:{" "}
                    {item.ingredients
                      .map((ing) => {
                        const stock = stockItems.find(
                          (s) => s.id === ing.stockId
                        );
                        return stock
                          ? `${stock.name} × ${ing.quantity}`
                          : `${ing.stockId} × ${ing.quantity}`;
                      })
                      .join(", ")}
                  </div>
                ) : (
                  <div className="text-sm opacity-60">
                    No ingredients linked
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



/*


"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { formatMoney } from "@/lib/money";
import { listStockItems, type StockItem } from "@/firebase/stock";
import {
  createMenuItem,
  deleteMenuItem,
  listMenuItems,
  type MenuCategory,
  type MenuIngredient,
  type MenuItem,
} from "@/firebase/menu";

type IngredientRow = {
  stockId: string;
  quantity: number;
};

export default function MenuPage() {
  const { user, profile } = useAuth();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [priceMinor, setPriceMinor] = useState(0);
  const [category, setCategory] = useState<MenuCategory>("food");
  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([]);

  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";

  const load = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const [menus, stock] = await Promise.all([
      listMenuItems(user.uid),
      listStockItems(user.uid),
    ]);

    const safeMenus = menus.map((item) => ({
      ...item,
      ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
    }));

    setMenuItems(safeMenus);
    setStockItems(stock);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) return null;

  function addIngredientRow() {
    setIngredientRows((prev) => [...prev, { stockId: "", quantity: 1 }]);
  }

  function updateIngredientRow(index: number, patch: Partial<IngredientRow>) {
    setIngredientRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  }

  function removeIngredientRow(index: number) {
    setIngredientRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCreateMenuItem() {
    if (!name.trim()) return;
    if (!Number.isInteger(priceMinor) || priceMinor <= 0) return;

    const ingredients: MenuIngredient[] = ingredientRows
      .filter((row) => row.stockId && row.quantity > 0)
      .map((row) => ({
        stockId: row.stockId,
        quantity: row.quantity,
      }));

    await createMenuItem(user.uid, {
      name,
      priceMinor,
      category,
      ingredients,
    });

    setName("");
    setPriceMinor(0);
    setCategory("food");
    setIngredientRows([]);
    await load();
  }

  async function handleDelete(menuId: string) {
    if (!confirm("Delete this menu item?")) return;
    await deleteMenuItem(user.uid, menuId);
    await load();
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Menu</h1>

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
            min={1}
            placeholder={`Price (${currency}) minor units`}
            value={priceMinor}
            onChange={(e) => setPriceMinor(Number(e.target.value))}
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
          onClick={handleCreateMenuItem}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Save menu item
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Current menu</h2>

        {loading ? (
          <p className="opacity-70">Loading…</p>
        ) : menuItems.length === 0 ? (
          <p className="opacity-70">No menu items.</p>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div key={item.id} className="rounded border p-4 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm opacity-70">
                      {formatMoney(item.priceMinor, currency)} · {item.category}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>

                {item.ingredients.length > 0 ? (
                  <div className="text-sm opacity-80">
                    Ingredients:{" "}
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
                  <div className="text-sm opacity-60">
                    No ingredients linked
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



















*/