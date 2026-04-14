"use client";

import { useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { completeCheckout, type CheckoutItem } from "@/firebase/checkout";

type Props = {
  items: CheckoutItem[];
  total: number;
  onSuccess: () => void;
};

export default function CheckoutButton({ items, total, onSuccess }: Props) {
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

    setLoading(true);
    setError(null);

    try {
      await completeCheckout({
        uid: user.uid,
        dayKey,
        items,
        total,
      });

      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Checkout failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full rounded border px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Completing..." : "Checkout"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}