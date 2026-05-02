"use client";

import MenuItemCard from "../pos/MenuItemCard";
import type { MenuItem } from "@/types";

type Props = {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
};

export default function MenuList({ items, onAdd }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}