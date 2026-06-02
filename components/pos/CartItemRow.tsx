"use client";

import { formatMoney } from "@/lib/money";
import { useAuth } from "@/firebase/authProvider";
import Button from "@/components/ui/Button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import type { CartItemRowProps } from "@/types/pos";
import { useTranslation } from "react-i18next";

export default function CartItemRow({ item, onAdd, onRemove }: CartItemRowProps) {
  const { profile } = useAuth();
  const currency = profile?.nextillApp.settings.currency ?? "EUR";
  const { t } = useTranslation("pos")

  const lineTotal = item.quantity * item.priceMinor;

  return (
    <article className={`flex items-center justify-between gap-3 rounded-2xl
                         border border-default bg-surface-2 px-3 py-3`}>
      <div className="min-w-0 space-y-1">
        <h3 className="truncate text-sm font-semibold leading-tight">
          {item.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>
            {item.quantity} × {formatMoney(item.priceMinor, currency)}
          </span>
          <span aria-hidden="true">•</span>
          <span className="font-medium text-foreground">
            {formatMoney(lineTotal, currency)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={onRemove}
          aria-label={t("cart.removeItemAriaLabel", { itemName: item.name })}
          title={t("cart.removeItemTitle", { itemName: item.name })}
          className="h-9 w-9 px-0 py-0"
        >
          <FaMinus className="text-xs" aria-hidden="true" />
        </Button>

        <span
          className={`inline-flex min-w-10 items-center justify-center rounded-xl
                      border border-default bg-surface-1 px-3 py-2 text-sm font-semibold`}
          aria-label={t("cart.quantityAriaLabel", { count: item.quantity })}
        >
          {item.quantity}
        </span>

        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={onAdd}
          className="h-9 w-9 px-0 py-0"
          aria-label={t("cart.addItemAriaLabel", { itemName: item.name })}
          title={t("cart.addItemTitle", { itemName: item.name })}
        >
          <FaPlus className="text-xs" aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
}
