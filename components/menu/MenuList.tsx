"use client";

import type { StockItem } from "@/firebase/stock";
import type { MenuItem as MenuItemData } from "@/firebase/menu";
import MenuItem from "./MenuItem";

type Props = {
  loading: boolean;
  menuItems: MenuItemData[];
  stockItems: StockItem[];
  currency: string;
  onDelete: (menuId: string) => void;
};

export default function MenuList({
  loading,
  menuItems,
  stockItems,
  currency,
  onDelete,
}: Props) {
  return (
    <div className="space-y-3">

      {loading ? (
        <p className="opacity-70">Loading…</p>
      ) : menuItems.length === 0 ? (
        <p className="opacity-70">No menu items.</p>
      ) : (
        <div className="space-y-3">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              stockItems={stockItems}
              currency={currency}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}