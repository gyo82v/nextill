"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { listActiveMenuItems } from "@/firebase/menu";
import type { MenuItem } from "@/types/";
import MenuList from "@/components/pos/MenuList";
import CartPanel from "@/components/pos/CartPanel";
import CheckoutButton from "@/components/pos/CheckoutButton";
import StartDay from "@/components/pos/StartDay";
import EndDay from "@/components/pos/EndDay";
import MobileCartBar from "@/components/pos/MobileCartBar";
import MobileCartDrawer from "@/components/pos/MobileCartDrawer";
import { useCartStore } from "@/store/useCartStore";
import { SmallDivider } from "@/components/ui/dividers/Dividers";
import { useTranslation } from "react-i18next";
import { playSound } from "@/lib/sound";

export default function PosPage() {
  const { user, profile } = useAuth();
  const cart = useCartStore();
  const { t } = useTranslation("pos");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const soundEnabled = profile?.nextillApp?.settings?.soundEnabled ?? true;
  // If your path is different, adjust this line only.

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
    let cancelled = false;

    const run = async () => {
      await loadMenu();
      if (cancelled) return;
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [loadMenu]);

  const handleAddItem = useCallback(
    (item: MenuItem) => {
      cart.addItem(item);

      if (soundEnabled) {
        playSound("addToCart");
      }
    },
    [cart, soundEnabled]
  );

  const handleAddItemById = useCallback(
    (id: string) => {
      const item = menuItems.find((i) => i.id === id);
      if (!item) return;

      handleAddItem(item);
    },
    [menuItems, handleAddItem]
  );

  const checkoutItems = useMemo(
    () =>
      cart.items.map((cartItem) => ({
        ...cartItem,
        menu: menuItems.find((m) => m.id === cartItem.id)!,
      })),
    [cart.items, menuItems]
  );

  const mobileItemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  if (!cart.hydrated) {
    return <div className="p-6 opacity-70">{t("loadingCart")}</div>;
  }

  if (!user) return null;

  const dayActive = profile?.nextillApp?.dayCycle?.active ?? false;

  if (!dayActive) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <StartDay />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1550px] space-y-6 px-4 lg:px-10 py-10 lg:py-12">
     
        <div
          className={`grid gap-5 xl:gap-20 lg:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.85fr)]
                         xl:grid-cols-[minmax(0,1.5fr)_minmax(23rem,0.9fr)]`}
        >
          <div className="min-w-0 rounded-3xl border border-default bg-surface-1 p-4 shadow-sm lg:p-5">
            {menuLoading ? (
              <p className="opacity-70">{t("loadingMenu")}</p>
            ) : (
              <MenuList items={menuItems} onAdd={handleAddItem} />
            )}
          </div>

          <aside
            className={`hidden lg:block lg:top-6 lg:self-start 
                         lg:pr-1`}
          >
            <div className="space-y-5 rounded-3xl border border-default bg-surface-1 p-4 shadow-sm lg:p-5">
              <CartPanel
                items={cart.items}
                totalMinor={cart.totalMinor}
                onAdd={handleAddItemById}
                onRemove={cart.removeItem}
              />
               
              <div className="sticky bottom-0 bg-surface-1 pt-4">
                <CheckoutButton
                  items={checkoutItems}
                  totalMinor={cart.totalMinor}
                  onSuccess={cart.clearCart}
                />
              </div>

              <SmallDivider className="hidden lg:block lg:my-14" />
              <EndDay device="desktop" />
            </div>
          </aside>
        </div>
      </div>

      <SmallDivider className="my-14 lg:my-0 lg:hidden " />

      <div className="lg:hidden px-4 pb-6">
        <EndDay device="mobile" />
      </div>

      <MobileCartBar
        itemCount={mobileItemCount}
        totalMinor={cart.totalMinor}
        onOpen={() => setMobileCartOpen(true)}
      />

      <MobileCartDrawer
        open={mobileCartOpen}
        onClose={() => setMobileCartOpen(false)}
        items={cart.items}
        checkoutItems={checkoutItems}
        totalMinor={cart.totalMinor}
        onAdd={handleAddItemById}
        onRemove={cart.removeItem}
        onSuccess={() => {
          cart.clearCart();
          setMobileCartOpen(false);
        }}
      />
    </>
  );
}

