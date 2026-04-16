"use client";

import MenuList from "@/components/menu/MenuList";
import CartPanel from "@/components/cart/CartPanel";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { useCartStore } from "@/store/useCartStore";
import type { MenuItem } from "@/types";
import EndDay from "@/components/till/EndDay";
import StartDay from "@/components/till/StartDay";
import { useAuth } from "@/firebase/authProvider";

const MOCK_MENU: MenuItem[] = [
  { id: "1", name: "Coffee", priceMinor: 150 },
  { id: "2", name: "Croissant", priceMinor: 220 },
  { id: "3", name: "Sandwich", priceMinor: 450 },
];

export default function TillPage() {
  const cart = useCartStore();
  const { profile } = useAuth();

  if (!cart.hydrated) {
    return (
      <div className="p-6 opacity-70">
        Loading cart…
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {profile?.nextillApp.dayCycle.active ?  (
        <>
         <div className="col-span-2">
        <MenuList items={MOCK_MENU} onAdd={cart.addItem} />
      </div>

      <div>
        <CartPanel
          items={cart.items}
          totalMinor={cart.totalMinor}
          onAdd={(id) =>
            cart.addItem(
              MOCK_MENU.find((i) => i.id === id)!
            )
          }
          onRemove={cart.removeItem}
        />

        <CheckoutButton
          items={cart.items}
          totalMinor={cart.totalMinor}
          onSuccess={cart.clearCart}
        />
      </div>
      <EndDay />       
        </>
      ) : <StartDay />}
    </div>
  );
}
