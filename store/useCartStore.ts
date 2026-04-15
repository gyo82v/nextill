"use client";

import { useEffect, useState } from "react";
import type { MenuItem, CartItem } from "@/types";

const STORAGE_KEY = "nextill-cart";

function calculateTotal(items: CartItem[]) {
  return items.reduce(
    (sum, i) => sum + i.priceMinor * i.quantity,
    0
  );
}

export function useCartStore() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalMinor, setTotalMinor] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // 1️⃣ Load cart once (client-only)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setHydrated(true);
      return;
    }

    try {
      const parsed: CartItem[] = JSON.parse(raw);
      setItems(parsed);
      setTotalMinor(calculateTotal(parsed));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  // 2️⃣ Persist on change (after hydration)
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    setTotalMinor(calculateTotal(items));
  }, [items, hydrated]);

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

  function removeItem(id: string) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function clearCart() {
    setItems([]);
    setTotalMinor(0);
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    items,
    totalMinor,
    hydrated,
    addItem,
    removeItem,
    clearCart,
  };
}

/*
"use client";

import { useMemo, useState } from "react";
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
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(itemId: string) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalMinor = useMemo(() => {
    return items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0);
  }, [items]);

  return {
    items,
    totalMinor,
    addItem,
    removeItem,
    clearCart,
  };
}



*/