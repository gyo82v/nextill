"use client";

import MenuList from "@/components/menu/MenuList";
import CartPanel from "@/components/cart/CartPanel";
import CheckoutButton from "@/components/cart/CheckoutButton";
import StartDay from "@/components/till/StartDay";
import EndDay from "@/components/till/EndDay";
import { useAuth } from "@/firebase/authProvider";
import { useCartStore } from "@/store/useCartStore";
import type { MenuItem } from "@/types";

const MOCK_MENU: MenuItem[] = [
  { id: "1", name: "Coffee", price: 1.5 },
  { id: "2", name: "Croissant", price: 2.2 },
  { id: "3", name: "Sandwich", price: 4.5 },
];

export default function TillPage() {
  const { profile, loading } = useAuth();
  const cart = useCartStore();

  if (loading || !profile) {
    return <div className="p-6">Loading till…</div>;
  }

  const dayCycle = profile.nextillApp.dayCycle;
  const dayReady = dayCycle.active && !!dayCycle.dayKey;

  /* ───────────────────────────────
     DAY NOT ACTIVE
  ─────────────────────────────── */
  if (!dayCycle.active) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Till locked</h1>
        <p className="opacity-80">
          Start the day to enable the till.
        </p>
        <StartDay />
      </div>
    );
  }

  /* ───────────────────────────────
     DAY STARTING (edge case)
  ─────────────────────────────── */
  if (!dayReady) {
    return (
      <div className="p-6">
        <p className="opacity-80">
          Preparing day session…
        </p>
      </div>
    );
  }

  /* ───────────────────────────────
     DAY ACTIVE → FULL TILL
  ─────────────────────────────── */
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Till</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MenuList items={MOCK_MENU} onAdd={cart.addItem} />
        </div>

        <div className="space-y-4">
          <CartPanel
            items={cart.items}
            total={cart.total}
            onAdd={(id) =>
              cart.addItem(MOCK_MENU.find((i) => i.id === id)!)
            }
            onRemove={cart.removeItem}
          />

          <CheckoutButton
            items={cart.items}
            total={cart.total}
            onSuccess={cart.clearCart}
          />

          <EndDay />
        </div>
      </div>
    </div>
  );
}


/*
"use client";

import MenuList from "@/components/menu/MenuList";
import CartPanel from "@/components/cart/CartPanel";
import CheckoutButton from "@/components/cart/CheckoutButton";
import StartDay from "@/components/till/StartDay";
import EndDay from "@/components/till/EndDay";
import { useAuth } from "@/firebase/authProvider";
import { useCartStore } from "@/store/useCartStore";
import type { MenuItem } from "@/types";

const MOCK_MENU: MenuItem[] = [
  { id: "1", name: "Coffee", price: 1.5 },
  { id: "2", name: "Croissant", price: 2.2 },
  { id: "3", name: "Sandwich", price: 4.5 },
];

export default function TillPage() {
  const { profile, loading } = useAuth();
  const cart = useCartStore();

  if (loading) {
    return <div className="p-6">Loading till...</div>;
  }

  const dayActive = profile?.nextillApp?.dayCycle?.active ?? false;

  if (!dayActive) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Till locked</h1>
          <p className="text-sm opacity-80">
            The till is unavailable until the day is started.
          </p>
        </div>

        <StartDay />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Till</h1>
        <p className="text-sm opacity-80">
          The day is active. You can take orders now.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MenuList items={MOCK_MENU} onAdd={cart.addItem} />
        </div>

        <div className="space-y-4">
          <CartPanel
            items={cart.items}
            total={cart.total}
            onAdd={(id) => cart.addItem(MOCK_MENU.find((i) => i.id === id)!)}
            onRemove={cart.removeItem}
          />

          <CheckoutButton
            items={cart.items}
            total={cart.total}
            onSuccess={cart.clearCart}
          />

          <EndDay />
        </div>
      </div>
    </div>
  );
}
*/