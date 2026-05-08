"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { listStockItems } from "@/firebase/stock";
import {
  createMenuItem,
  deleteMenuItem,
  listMenuItems,
  clearMenuItems,
} from "@/firebase/menu";
import MenuList from "@/components/menu/MenuList";
import AddItemToMenu from "@/components/menu/AddItemToMenu";
import type { StockItem } from "@/types";
import type { IngredientRow, StockItemWithActive, MenuItem, MenuIngredient, DraftMenuCategory } from "@/types/menu";
import Button from "@/components/ui/Button";
import { MenuSectionDivider } from "@/components/ui/dividers/Dividers";
import { useTranslation } from "react-i18next";


export default function MenuPage() {
  const { user, profile } = useAuth();
  const { t } = useTranslation("menu");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [clearMenuLoading, setClearMenuLoading] = useState(false);
  const [saveItemLoading, setSaveItemLoading] = useState(false);
  const [deletingMenuId, setDeletingMenuId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");
  const [category, setCategory] = useState<DraftMenuCategory>("");
  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([]);

  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";

  const load = useCallback(async () => {
    if (!user) return;

    setPageLoading(true);

    const [menus, stock] = await Promise.all([
      listMenuItems(user.uid),
      listStockItems(user.uid),
    ]);

    const safeMenus = menus.map((item) => ({
      ...item,
      ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
    }));

    const activeStockItems = stock.filter(
      (item) => (item as StockItemWithActive).active !== false
    );

    setMenuItems(safeMenus);
    setStockItems(activeStockItems);
    setPageLoading(false);
  }, [user]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  if (!user) return null;

  function handleAddIngredient(ingredient: IngredientRow) {
  setIngredientRows((prev) => [...prev, ingredient]);
}

  function removeIngredientRow(index: number) {
    setIngredientRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleClearMenu() {
    if (!user) return;
    try{
      setClearMenuLoading(true)
      await clearMenuItems(user.uid);
      await load();
    }finally{
      setClearMenuLoading(false)
    }
  }

  async function handleCreateMenuItem() {
    if (!name.trim()) return;
    if (!user) return;
    if (!category) return;

    const price = Number(priceDisplay);
    if (!Number.isFinite(price) || price <= 0) return;

    try{
      setSaveItemLoading(true);
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
      setCategory("");
      setIngredientRows([]);
      await load();

    }finally{
      setSaveItemLoading(false);
    }
  }

  async function handleDelete(menuId: string) {
    if (!user) return;

    try{
      setDeletingMenuId(menuId);
      await deleteMenuItem(user.uid, menuId);
      await load();
    }finally{
      setDeletingMenuId(null);
    }
  }

  return (
    <div className={`w-full bg-[var(--background)] px-4 py-10
                     text-[var(--foreground)] sm:px-6 lg:px-8 lg:py-14 xl:py-16`}>
      <div className="relative grid w-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start ">
        <section className="flex w-full justify-center ">
          <div className="w-full max-w-2xl">
            <div className="mb-6 lg:mb-10">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("createSection.title")}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {t("createSection.description")}
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
              onAddIngredient={handleAddIngredient}
              removeIngredientRow={removeIngredientRow}
              loading={saveItemLoading}
              onSave={handleCreateMenuItem}
            />

          </div>
        </section>

        <MenuSectionDivider /> 

        <section className="flex w-full justify-center ">
          <div className="w-full max-w-2xl">
            <div className="mb-6 flex justify-between items-center lg:mb-10">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{t("listSection.title")}</h1>
                <p className="mt-1 text-sm text-muted">
                  {t("listSection.description")}
                </p>
              </div>
              <Button 
                variant="primary"
                loading={clearMenuLoading}
                onClick={handleClearMenu}
              >
                {t("listSection.clearAll")}
              </Button>
            </div>

            <MenuList
              loading={pageLoading}
              menuItems={menuItems}
              stockItems={stockItems}
              currency={currency}
              deletingMenuId={deletingMenuId}
              onDelete={handleDelete}
            />
          </div>
        </section>
      </div>
    </div>
  );
}






















