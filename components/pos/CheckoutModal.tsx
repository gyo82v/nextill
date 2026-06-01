"use client";

import { useEffect } from "react";
import { useAuth } from "@/firebase/authProvider";
import { formatMoney } from "@/lib/money";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import Button from "@/components/ui/Button";
import { FaCircleCheck, FaPrint, FaReceipt } from "react-icons/fa6";
import type { CheckoutModalProps } from "@/types/pos";

export default function CheckoutModal({
  open,
  success,
  items,
  totalMinor,
  loading = false,
  error = null,
  printingEnabled = true,
  onClose,
  onConfirm,
  onPrintStaffTicket,
  onPrintReceipt,
}: CheckoutModalProps) {
  const { profile } = useAuth();
  const currency = profile?.nextillApp.settings.currency ?? "EUR";
  const closingSoon = open && success && !printingEnabled;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!open || !success || printingEnabled) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [open, success, printingEnabled, onClose]);

  const title = success ? "Order completed" : "Complete order";

  const description = success
    ? printingEnabled
      ? "The sale was completed successfully."
      : "The sale was completed and saved."
    : "Review the order summary before finalizing the sale.";

  const confirmLabel = success ? "Print ticket" : "Complete order";
  const cancelLabel = success ? "New order" : "Back";

  const successFooter = printingEnabled ? (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="confirm"
        onClick={onPrintStaffTicket}
        className="w-full justify-center sm:w-auto"
      >
        <FaPrint className="text-sm" aria-hidden="true" />
        <span>Print staff ticket</span>
      </Button>

      <Button
        type="button"
        variant="secondary"
        onClick={onPrintReceipt}
        className="w-full justify-center sm:w-auto"
      >
        <FaReceipt className="text-sm" aria-hidden="true" />
        <span>Print receipt</span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        className="w-full justify-center sm:w-auto"
      >
        <span>New order</span>
      </Button>
    </div>
  ) : (
    <div className="space-y-2 text-right">
      {closingSoon ? (
        <p className="text-sm text-muted-foreground">Returning to POS...</p>
      ) : null}

      <Button
        type="button"
        variant="confirm"
        onClick={onClose}
        className="w-full justify-center sm:w-auto"
      >
        <span>Back to POS</span>
      </Button>
    </div>
  );

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={success ? onPrintStaffTicket : onConfirm}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      loading={loading}
      footer={success ? successFooter : undefined}
    >
      <div className="space-y-4">
        {success ? (
          <div className={`flex items-start gap-3 rounded-2xl border border-emerald-500/20
                         bg-emerald-500/5 p-4`}>
            <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center
                              rounded-full border border-emerald-500/20 bg-emerald-500/10
                             text-emerald-600 dark:text-emerald-300`}>
              <FaCircleCheck className="text-sm" aria-hidden="true" />
            </span>

            <div className="space-y-1">
              <p className="font-medium text-foreground">
                Sale completed successfully
              </p>
              <p className="text-sm text-muted-foreground">
                {printingEnabled
                  ? "You can print the tickets now or start a new order."
                  : "You can continue with the next order when ready."}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 rounded-2xl border border-default bg-surface-2 p-4">
              <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center
                                rounded-full border border-default bg-surface-1 text-muted-foreground`}>
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
                    className={`flex items-start justify-between gap-4 rounded-2xl
                                border border-default bg-surface-2 px-3 py-3`}
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

            <div className={`flex items-center justify-between rounded-2xl border
                             border-default bg-surface-2 px-4 py-3`}>
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
          </>
        )}
      </div>
    </ConfirmModal>
  );
}
