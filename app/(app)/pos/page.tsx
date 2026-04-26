"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { listMenuItems, type MenuItem } from "@/firebase/menu";
import MenuList from "@/components/menu/MenuList";
import CartPanel from "@/components/cart/CartPanel";
import CheckoutButton from "@/components/cart/CheckoutButton";
import StartDay from "@/components/till/StartDay";
import EndDay from "@/components/till/EndDay";
import { useCartStore } from "@/store/useCartStore";

export default function TillPage() {
  const { user, profile } = useAuth();
  const cart = useCartStore();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const loadMenu = useCallback(async () => {
    if (!user) return;

    setMenuLoading(true);
    const items = await listMenuItems(user.uid);

    // Safety: ensure ingredients is always an array
    const safeItems = items.map((item) => ({
      ...item,
      ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
    }));

    setMenuItems(safeItems);
    setMenuLoading(false);
  }, [user]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  if (!cart.hydrated) {
    return <div className="p-6 opacity-70">Loading cart…</div>;
  }

  if (!user) return null;

  const dayActive = profile?.nextillApp?.dayCycle?.active ?? false;

  if (!dayActive) {
    return (
      <div className="p-6 space-y-6">
        <StartDay />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div className="col-span-2">
        {menuLoading ? (
          <p className="opacity-70">Loading menu…</p>
        ) : (
          <MenuList items={menuItems} onAdd={cart.addItem} />
        )}
      </div>

      <div className="space-y-6">
        <CartPanel
          items={cart.items}
          totalMinor={cart.totalMinor}
          onAdd={(id) => {
            const item = menuItems.find((i) => i.id === id);
            if (!item) return;
            cart.addItem(item);
          }}
          onRemove={cart.removeItem}
        />

<CheckoutButton
  items={cart.items.map((cartItem) => ({
    ...cartItem,
    menu: menuItems.find((m) => m.id === cartItem.id)!,
  }))}
  totalMinor={cart.totalMinor}
  onSuccess={cart.clearCart}
/>

        <EndDay />
      </div>
    </div>
  );
}


