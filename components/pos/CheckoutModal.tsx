"use client";

import type { CheckoutItem } from "@/firebase/checkout";
import { useAuth } from "@/firebase/authProvider";
import { formatMoney } from "@/lib/money";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import { FaReceipt } from "react-icons/fa6";

type Props = {
  open: boolean;
  items: CheckoutItem[];
  totalMinor: number;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function CheckoutModal({
  open,
  items,
  totalMinor,
  loading = false,
  error = null,
  onClose,
  onConfirm,
}: Props) {
  const { profile } = useAuth();
  const currency = profile?.nextillApp.settings.currency ?? "EUR";

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Complete order"
      description="Review the order summary before finalizing the sale."
      confirmLabel="Complete order"
      cancelLabel="Back"
      loading={loading}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl border border-default bg-surface-2 p-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-default bg-surface-1 text-muted-foreground">
            <FaReceipt className="text-sm" aria-hidden="true" />
          </span>

          <div className="space-y-1">
            <p className="font-medium">Order recap</p>
            <p className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"} in this order.
            </p>
          </div>
        </div>

        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {items.map((item, index) => {
            const lineTotal = item.quantity * item.priceMinor;
            const name = item.menu?.name ?? item.name ?? "Item";

            return (
              <div
                key={`${item.id}-${index}`}
                className="flex items-start justify-between gap-4 rounded-2xl border border-default bg-surface-2 px-3 py-3"
              >
                <div className="min-w-0 space-y-1">
                  <h3 className="truncate text-sm font-semibold leading-tight">
                    {name}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatMoney(item.priceMinor, currency)}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">
                    {formatMoney(lineTotal, currency)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-default bg-surface-2 px-4 py-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-semibold">
            {formatMoney(totalMinor, currency)}
          </span>
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert" aria-live="polite">
            {error}
          </p>
        ) : null}
      </div>
    </ConfirmModal>
  );
}