"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { listActiveMenuItems, type MenuItem } from "@/firebase/menu";
import MenuList from "@/components/pos/MenuList";
import CartPanel from "@/components/pos/CartPanel";
import CheckoutButton from "@/components/pos/CheckoutButton";
import StartDay from "@/components/till/StartDay";
import EndDay from "@/components/pos/EndDay";
import { useCartStore } from "@/store/useCartStore";

export default function TillPage() {
  const { user, profile } = useAuth();
  const cart = useCartStore();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const loadMenu = useCallback(async () => {
    if (!user) return;

    setMenuLoading(true);
    const items = await listActiveMenuItems(user.uid);

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
    <div className="mx-auto w-full max-w-[1800px] space-y-6 px-4 py-4 lg:px-6 lg:py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Point of sale</h1>
        <p className="text-sm text-muted-foreground">
          Add dishes quickly, review the cart, and complete the order.
        </p>
      </header>

      <div className="grid gap-5 xl:gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.85fr)] xl:grid-cols-[minmax(0,1.5fr)_minmax(23rem,0.9fr)]">
        <main className="min-w-0 rounded-3xl border border-default bg-surface-1 p-4 shadow-sm lg:p-5">
          {menuLoading ? (
            <p className="opacity-70">Loading menu…</p>
          ) : (
            <MenuList items={menuItems} onAdd={cart.addItem} />
          )}
        </main>

        <aside className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
          <div className="space-y-5 rounded-3xl border border-default bg-surface-1 p-4 shadow-sm lg:p-5">
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
        </aside>
      </div>
    </div>
  );
}



/*

"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { listActiveMenuItems, type MenuItem } from "@/firebase/menu";
import MenuList from "@/components/pos/MenuList";
import CartPanel from "@/components/pos/CartPanel";
import CheckoutButton from "@/components/pos/CheckoutButton";
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
    const items = await listActiveMenuItems(user.uid);

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
    <div className="space-y-6 p-4 lg:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Point of sale</h1>
        <p className="text-sm text-muted-foreground">
          Add dishes quickly, review the cart, and complete the order.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(22rem,0.85fr)] xl:grid-cols-[minmax(0,1.6fr)_minmax(24rem,0.8fr)]">
        <main className="min-w-0">
          {menuLoading ? (
            <p className="opacity-70">Loading menu…</p>
          ) : (
            <MenuList items={menuItems} onAdd={cart.addItem} />
          )}
        </main>

        <aside className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
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
        </aside>
      </div>
    </div>
  );
}








*/


