"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { completeCheckout } from "@/firebase/checkout";
import Button from "@/components/ui/Button";
import CheckoutModal from "./CheckoutModal";
import { FaReceipt } from "react-icons/fa6";
import { openStaffTicketPrintWindow } from "./staffTicketPrint";
import { openReceiptPrintWindow } from "./receiptPrint";
import type { CheckoutButtonProps, CheckoutItem } from "@/types";
import { useTranslation } from "react-i18next";
import { playSound } from "@/lib/sound";
import type { Discount } from "@/types/discount";
import { applyDiscount } from "@/lib/discount";

export default function CheckoutButton({
  items,
  totalMinor,
  onSuccess,
}: CheckoutButtonProps) {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptItems, setReceiptItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const { t } = useTranslation("pos");

  const dayKey = profile?.nextillApp?.dayCycle?.dayKey ?? null;
  const currency = profile?.nextillApp.settings.currency ?? "EUR";
  const receiptEnabled = profile?.nextillApp.settings.receiptEnabled ?? true;
  const ticketEnabled = profile?.nextillApp.settings.ticketEnabled ?? true;
  const soundEnabled = profile?.nextillApp?.settings?.soundEnabled ?? true;
  const paymentEnabled = !!profile?.nextillApp?.settings?.paymentMethodSelectionEnabled;

  const canCheckout = items.length > 0 && !!user && !!dayKey;
  const discountedTotalMinor = appliedDiscount ? applyDiscount(totalMinor, appliedDiscount)
                                               : totalMinor;

  const recapItems = useMemo(() => items, [items]);

  function resetModalState() {
    setOpen(false);
    setSuccess(false);
    setReceiptItems([]);
    setTicketNumber(null);
    setError(null);
    setAppliedDiscount(null);
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
      setError(`${t("checkout.loginError")}`);
      return;
    }

    if (!dayKey) {
      setError(`${t("checkout.noActiveDayError")}`);
      return;
    }

    if (items.length === 0) {
      setError(`${t("checkout.emptyCartError")}`);
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
        totalMinor: discountedTotalMinor,
        paymentMethod: paymentEnabled   ,
      });

      setReceiptItems(submittedItems);
      setTicketNumber(result.ticketNumber);
      setSuccess(true);
      if (soundEnabled) {
        playSound("orderComplete");
      }
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : `${t("checkout.checkoutError")}`;
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
            {t("checkout.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("checkout.description")}
          </p>
        </div>

        <Button
          type="button"
          loading={loading}
          loadingText={t("checkout.buttonLoading")}
          onClick={handleOpen}
          disabled={!canCheckout}
          className="w-full justify-center"
        >
          <FaReceipt className="text-sm" aria-hidden="true" />
          <span>{t("checkout.button")}</span>
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
        totalMinor={discountedTotalMinor}
        appliedDiscount={appliedDiscount}
        onDiscountChange={setAppliedDiscount}
        discountEnabled={profile?.nextillApp.settings.discountEnabled ?? false}
        loading={loading}
        error={error}
        receiptEnabled={receiptEnabled}
        ticketEnabled={ticketEnabled}
        onClose={resetModalState}
        onConfirm={handleCheckout}
        onPrintStaffTicket={handlePrintStaffTicket}
        onPrintReceipt={handlePrintReceipt}
      />
    </>
  );
}
