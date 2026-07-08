"use client";

import CartItemRow from "./CartItemRow";
import { formatMoney } from "@/lib/money";
import { useAuth } from "@/firebase/authProvider";
import { cardBaseStyle } from "@/styles";
import { FaCartShopping } from "react-icons/fa6";
import type { CartPanelProps } from "@/types/pos";
import { useTranslation } from "react-i18next";
import { FiPrinter } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { openStaffTicketPrintWindow } from "./staffTicketPrint";
import type { CheckoutItem, CartItem } from "@/types";

export default function CartPanel({
  items,
  totalMinor,
  onAdd,
  onRemove,
}: CartPanelProps) {
  const { profile } = useAuth();
  const currency = profile?.nextillApp.settings.currency ?? "EUR";
  const { t } = useTranslation("pos")

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  console.log("items: ", items);

  function mapCartItemsToCheckoutItems(items: CartItem[]): CheckoutItem[] {
  return items.flatMap((item) =>
    Array.from({ length: item.quantity }).map(
      () =>
        ({
          id: item.id,
          name: item.name,
          priceMinor: item.priceMinor,
          quantity: 1,
          category: (item as CartItem & { category?: string }).category,
        }) as CheckoutItem
    )
  );
}

  function handlePrintCart() {
  if (items.length === 0) return;

  const printableItems = mapCartItemsToCheckoutItems(items);

  openStaffTicketPrintWindow({
    ticketNumber: "☀ ~ BEACH ~ ☀",
    items: printableItems,
  });
}

  return (
    <section
      aria-labelledby="cart-panel-title"
      className={`${cardBaseStyle} space-y-4 rounded-2xl border border-default bg-transparent p-4`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full
                              border border-default bg-surface-2 text-muted-foreground`}>
              <FaCartShopping className="text-sm" aria-hidden="true" />
            </span>

            <h2 id="cart-panel-title" className="text-lg font-semibold tracking-tight">
              {t("cart.title")}
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">
            {t("cart.description")}
          </p>
        </div>

        <div className="">
          <Button
            variant="secondary"
            title="print cart"
            aria-label="print cart"
            type="button"
            onClick={handlePrintCart}
          >
            <FiPrinter className="text-sm" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="space-y-2.5">
        {items.length === 0 ? (
          <div className={`flex flex-col items-center justify-center rounded-2xl
                           border border-dashed border-default bg-surface-2 px-4 py-8 text-center`}>
            <span className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full
                              border border-default bg-surface-1 text-muted-foreground`}>
              <FaCartShopping className="text-lg" aria-hidden="true" />
            </span>
            <p className="font-medium">{t("cart.emptyTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("cart.emptyDescription")}
            </p>
          </div>
        ) : (
          <ul className="space-y-2" aria-label={t("cart.listLabel")}>
            {items.map((item) => (
              <li key={item.id}>
                <CartItemRow
                  item={item}
                  onAdd={() => onAdd(item.id)}
                  onRemove={() => onRemove(item.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="space-y-3 border-t border-default pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">{t("cart.totalLabel")}</span>
          <span className="text-xl font-semibold tracking-tight">
            {formatMoney(totalMinor, currency)}
          </span>
        </div>
      </footer>
    </section>
  );
}


/*
function mapCartItemsToCheckoutItems(items: CartItem[]): CheckoutItem[] {
  return items.flatMap((item) =>
    Array.from({ length: item.quantity }).map(() => ({
      id: item.id,
      name: item.name,
      priceMinor: item.priceMinor,
      quantity: 1,          // IMPORTANT: one ticket = one unit
      menu: item.menu,      // required by CheckoutItem
    }))
  );
}



"use client";

import CartItemRow from "./CartItemRow";
import { formatMoney } from "@/lib/money";
import { useAuth } from "@/firebase/authProvider";
import { cardBaseStyle } from "@/styles";
import { FaCartShopping } from "react-icons/fa6";
import type { CartPanelProps } from "@/types/pos";
import { useTranslation } from "react-i18next";
import { FiPrinter } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function CartPanel({
  items,
  totalMinor,
  onAdd,
  onRemove,
}: CartPanelProps) {
  const { profile } = useAuth();
  const currency = profile?.nextillApp.settings.currency ?? "EUR";
  const { t } = useTranslation("pos")

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section
      aria-labelledby="cart-panel-title"
      className={`${cardBaseStyle} space-y-4 rounded-2xl border border-default bg-transparent p-4`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full
                              border border-default bg-surface-2 text-muted-foreground`}>
              <FaCartShopping className="text-sm" aria-hidden="true" />
            </span>

            <h2 id="cart-panel-title" className="text-lg font-semibold tracking-tight">
              {t("cart.title")}
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">
            {t("cart.description")}
          </p>
        </div>

        <span className={`rounded-full border border-default bg-surface-2 px-2.5
                          py-1 text-xs font-medium text-muted-foreground`}>
          {itemCount} {t("cart.itemCount", { count: itemCount })}
        </span>
      </header>

      <div className="space-y-2.5">
        {items.length === 0 ? (
          <div className={`flex flex-col items-center justify-center rounded-2xl
                           border border-dashed border-default bg-surface-2 px-4 py-8 text-center`}>
            <span className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full
                              border border-default bg-surface-1 text-muted-foreground`}>
              <FaCartShopping className="text-lg" aria-hidden="true" />
            </span>
            <p className="font-medium">{t("cart.emptyTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("cart.emptyDescription")}
            </p>
          </div>
        ) : (
          <ul className="space-y-2" aria-label={t("cart.listLabel")}>
            {items.map((item) => (
              <li key={item.id}>
                <CartItemRow
                  item={item}
                  onAdd={() => onAdd(item.id)}
                  onRemove={() => onRemove(item.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="space-y-3 border-t border-default pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">{t("cart.totalLabel")}</span>
          <span className="text-xl font-semibold tracking-tight">
            {formatMoney(totalMinor, currency)}
          </span>
        </div>
      </footer>
    </section>
  );
}


=== BEACH ===

*/
