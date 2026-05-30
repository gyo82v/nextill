"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { completeCheckout, type CheckoutItem } from "@/firebase/checkout";
import Button from "@/components/ui/Button";
import CheckoutModal from "./CheckoutModal";
import { FaReceipt } from "react-icons/fa6";
import { openStaffTicketPrintWindow } from "./staffTicketPrint";
import { openReceiptPrintWindow } from "./receiptPrint";

type Props = {
  items: CheckoutItem[];
  totalMinor: number;
  onSuccess: () => void;
};

export default function CheckoutButton({
  items,
  totalMinor,
  onSuccess,
}: Props) {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptItems, setReceiptItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);

  const dayKey = profile?.nextillApp?.dayCycle?.dayKey ?? null;
  const currency = profile?.nextillApp.settings.currency ?? "EUR";
  const printingEnabled = profile?.nextillApp.settings.printingEnabled ?? true;

  const canCheckout = items.length > 0 && !!user && !!dayKey;

  const recapItems = useMemo(() => items, [items]);

  function resetModalState() {
    setOpen(false);
    setSuccess(false);
    setReceiptItems([]);
    setTicketNumber(null);
    setError(null);
  }

  function handleOpen() {
    if (!canCheckout) return;

    setError(null);
    setSuccess(false);
    setReceiptItems([]);
    setTicketNumber(null);
    setOpen(true);
  }

  async function handleCheckout() {
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    if (!dayKey) {
      setError("No active day selected.");
      return;
    }

    if (items.length === 0) {
      setError("Cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    const submittedItems = items;

    try {
      const result = await completeCheckout({
        uid: user.uid,
        dayKey,
        items: submittedItems,
        totalMinor,
      });

      setReceiptItems(submittedItems);
      setTicketNumber(result.ticketNumber);
      setSuccess(true);
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePrintStaffTicket() {
    const visibleItems = receiptItems.length > 0 ? receiptItems : recapItems;

    if (visibleItems.length === 0) return;

    openStaffTicketPrintWindow({
      ticketNumber: String(ticketNumber ?? 0),
      items: visibleItems,
    });
  }

  async function handlePrintReceipt() {
    const visibleItems = receiptItems.length > 0 ? receiptItems : recapItems;

    if (visibleItems.length === 0) return;

    openReceiptPrintWindow({
      items: visibleItems,
      totalMinor,
      currency,
    });
  }

  return (
    <>
      <section
        aria-labelledby="checkout-panel-title"
        className="space-y-3 rounded-2xl border border-default bg-surface-2 p-4"
      >
        <div className="space-y-1">
          <h3 id="checkout-panel-title" className="font-semibold tracking-tight">
            Checkout
          </h3>
          <p className="text-sm text-muted-foreground">
            Review the order before completing it.
          </p>
        </div>

        <Button
          type="button"
          variant="confirm"
          loading={loading}
          loadingText="Completing..."
          onClick={handleOpen}
          disabled={!canCheckout}
          className="w-full justify-center"
        >
          <FaReceipt className="text-sm" aria-hidden="true" />
          <span>Checkout</span>
        </Button>

        {error ? (
          <p className="text-sm text-red-600" role="alert" aria-live="polite">
            {error}
          </p>
        ) : null}
      </section>

      <CheckoutModal
        open={open}
        success={success}
        items={recapItems}
        totalMinor={totalMinor}
        loading={loading}
        error={error}
        printingEnabled={printingEnabled}
        onClose={resetModalState}
        onConfirm={handleCheckout}
        onPrintStaffTicket={handlePrintStaffTicket}
        onPrintReceipt={handlePrintReceipt}
      />
    </>
  );
}

/*

"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { completeCheckout, type CheckoutItem } from "@/firebase/checkout";
import Button from "@/components/ui/Button";
import CheckoutModal from "./CheckoutModal";
import { FaReceipt } from "react-icons/fa6";
import { openStaffTicketPrintWindow } from "./staffTicketPrint";
import { openReceiptPrintWindow } from "./receiptPrint";

type Props = {
  items: CheckoutItem[];
  totalMinor: number;
  onSuccess: () => void;
};

export default function CheckoutButton({
  items,
  totalMinor,
  onSuccess,
}: Props) {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptItems, setReceiptItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);

  const dayKey = profile?.nextillApp?.dayCycle?.dayKey ?? null;
  const currency = profile?.nextillApp.settings.currency ?? "EUR";

  const canCheckout = items.length > 0 && !!user && !!dayKey;
  const recapItems = useMemo(() => items, [items]);

  function resetModalState() {
    setOpen(false);
    setSuccess(false);
    setReceiptItems([]);
    setTicketNumber(null);
    setError(null);
  }

  function handleOpen() {
    if (!canCheckout) return;

    setError(null);
    setSuccess(false);
    setReceiptItems([]);
    setTicketNumber(null);
    setOpen(true);
  }

  async function handleCheckout() {
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    if (!dayKey) {
      setError("No active day selected.");
      return;
    }

    if (items.length === 0) {
      setError("Cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    const submittedItems = items;

    try {
      const result = await completeCheckout({
        uid: user.uid,
        dayKey,
        items: submittedItems,
        totalMinor,
      });

      setReceiptItems(submittedItems);
      setTicketNumber(result.ticketNumber);
      setSuccess(true);
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePrintStaffTicket() {
    const visibleItems = receiptItems.length > 0 ? receiptItems : recapItems;

    if (visibleItems.length === 0) return;

    openStaffTicketPrintWindow({
      ticketNumber: String(ticketNumber ?? 0),
      items: visibleItems,
    });
  }

  async function handlePrintReceipt() {
    const visibleItems = receiptItems.length > 0 ? receiptItems : recapItems;

    if (visibleItems.length === 0) return;

    openReceiptPrintWindow({
      items: visibleItems,
      totalMinor,
      currency,
    });
  }

  return (
    <>
      <section
        aria-labelledby="checkout-panel-title"
        className="space-y-3 rounded-2xl border border-default bg-surface-2 p-4"
      >
        <div className="space-y-1">
          <h3 id="checkout-panel-title" className="font-semibold tracking-tight">
            Checkout
          </h3>
          <p className="text-sm text-muted-foreground">
            Review the order before completing it.
          </p>
        </div>

        <Button
          type="button"
          variant="confirm"
          loading={loading}
          loadingText="Completing..."
          onClick={handleOpen}
          disabled={!canCheckout}
          className="w-full justify-center"
        >
          <FaReceipt className="text-sm" aria-hidden="true" />
          <span>Checkout</span>
        </Button>

        {error ? (
          <p className="text-sm text-red-600" role="alert" aria-live="polite">
            {error}
          </p>
        ) : null}
      </section>

      <CheckoutModal
        open={open}
        success={success}
        items={recapItems}
        totalMinor={totalMinor}
        loading={loading}
        error={error}
        onClose={resetModalState}
        onConfirm={handleCheckout}
        onPrintStaffTicket={handlePrintStaffTicket}
        onPrintReceipt={handlePrintReceipt}
      />
    </>
  );
}


*/