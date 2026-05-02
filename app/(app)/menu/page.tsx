"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { listStockItems, type StockItem } from "@/firebase/stock";
import {
  createMenuItem,
  deleteMenuItem,
  listMenuItems,
  type MenuCategory,
  type MenuIngredient,
  type MenuItem,
} from "@/firebase/menu";
import MenuList from "@/components/menu/MenuList";
import AddItemToMenu from "@/components/menu/AddItemToMenu";
import type { IngredientRow } from "@/components/menu/AddItemToMenu";

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
    if(!user) return;

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
    if(!user) return;
    if (!confirm("Delete this menu item?")) return;
    await deleteMenuItem(user.uid, menuId);
    await load();
  }

  return (
    <div className="min-h-screen w-full bg-[var(--background)] px-4 py-6 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        <section className="flex w-full justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold tracking-tight">
                Add item to menu
              </h1>
              <p className="mt-1 text-sm text-muted">
                Create a new menu item and link it to stock ingredients when needed.
              </p>
            </div>

            <AddItemToMenu
              currency={currency}
              stockItems={stockItems}
              name={name}
              setName={setName}
              priceDisplay={priceDisplay}
              setPriceDisplay={setPriceDisplay}
              category={category}
              setCategory={setCategory}
              ingredientRows={ingredientRows}
              addIngredientRow={addIngredientRow}
              updateIngredientRow={updateIngredientRow}
              removeIngredientRow={removeIngredientRow}
              onSave={handleCreateMenuItem}
            />
          </div>
        </section>

        <section className="flex w-full justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold tracking-tight">
                Current menu
              </h1>
              <p className="mt-1 text-sm text-muted">
                Review menu items and remove anything you no longer need.
              </p>
            </div>

            <MenuList
              loading={loading}
              menuItems={menuItems}
              stockItems={stockItems}
              currency={currency}
              onDelete={handleDelete}
            />
          </div>
        </section>
      </div>
    </div>
  );
}



/*

"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { listStockItems, type StockItem } from "@/firebase/stock";
import {
  createMenuItem,
  deleteMenuItem,
  listMenuItems,
  type MenuCategory,
  type MenuIngredient,
  type MenuItem,
} from "@/firebase/menu";
import MenuList from "@/components/menu/MenuList";
import AddItemToMenu  from "@/components/menu/AddItemToMenu";
import type { IngredientRow } from "@/components/menu/AddItemToMenu";

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

      <AddItemToMenu
        currency={currency}
        stockItems={stockItems}
        name={name}
        setName={setName}
        priceDisplay={priceDisplay}
        setPriceDisplay={setPriceDisplay}
        category={category}
        setCategory={setCategory}
        ingredientRows={ingredientRows}
        addIngredientRow={addIngredientRow}
        updateIngredientRow={updateIngredientRow}
        removeIngredientRow={removeIngredientRow}
        onSave={handleCreateMenuItem}
      />

      <MenuList
        loading={loading}
        menuItems={menuItems}
        stockItems={stockItems}
        currency={currency}
        onDelete={handleDelete}
      />
    </div>
  );
}







*/



















