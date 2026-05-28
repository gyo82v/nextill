"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { completeCheckout, type CheckoutItem } from "@/firebase/checkout";
import Button from "@/components/ui/Button";
import CheckoutModal from "./CheckoutModal";
import { FaReceipt } from "react-icons/fa6";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dayKey = profile?.nextillApp?.dayCycle?.dayKey ?? null;

  const canCheckout = items.length > 0 && !!user && !!dayKey;

  const recapItems = useMemo(() => items, [items]);

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

    try {
      await completeCheckout({
        uid: user.uid,
        dayKey,
        items,
        totalMinor,
      });

      setOpen(false);
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
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
          loading={loading}
          loadingText="Completing..."
          onClick={() => setOpen(true)}
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
        items={recapItems}
        totalMinor={totalMinor}
        loading={loading}
        error={error}
        onClose={() => {
          if (loading) return;
          setOpen(false);
        }}
        onConfirm={handleCheckout}
      />
    </>
  );
}

/*

"use client";

import { useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { completeCheckout, type CheckoutItem } from "@/firebase/checkout";
import Button from "@/components/ui/Button";
import { FaReceipt } from "react-icons/fa6";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dayKey = profile?.nextillApp?.dayCycle?.dayKey ?? null;

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

    try {
      await completeCheckout({
        uid: user.uid,
        dayKey,
        items,
        totalMinor,
      });

      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="checkout-panel-title"
      className="space-y-3 rounded-2xl border border-default bg-surface-2 p-4"
    >
      <div className="space-y-1">
        <h3 id="checkout-panel-title" className="font-semibold tracking-tight">
          Checkout
        </h3>
        <p className="text-sm text-muted-foreground">
          Complete the order when everything is ready.
        </p>
      </div>

      <Button
        type="button"
        loading={loading}
        loadingText="Completing..."
        onClick={handleCheckout}
        disabled={items.length === 0}
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
  );
}






*/