"use client";

import type { MenuListProps } from "@/types/menu";
import MenuItem from "./MenuItem";

export default function MenuList({
  loading,
  menuItems,
  stockItems,
  currency,
  loadingDelete,
  onDelete,
}: MenuListProps) {
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
              loading={loadingDelete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}