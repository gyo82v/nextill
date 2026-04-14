"use client";

import { useState } from "react";
import type { MenuItem } from "@/types";

export type CartItem = MenuItem & {
  quantity: number;
};

export function useCartStore() {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(item: MenuItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(itemId: string) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === itemId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return {
    items,
    total,
    addItem,
    removeItem,
    clearCart,
  };
}