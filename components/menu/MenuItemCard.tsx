"use client";

import type { MenuItem } from "@/types";

type Props = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
};

export default function MenuItemCard({ item, onAdd }: Props) {
  return (
    <button
      onClick={() => onAdd(item)}
      className="border rounded p-4 text-left hover:bg-muted"
    >
      <div className="font-medium">{item.name}</div>
      <div className="text-sm text-muted-foreground">
        €{item.price.toFixed(2)}
      </div>
    </button>
  );
}