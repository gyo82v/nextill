"use client";

import { useState } from "react";
import { endDay } from "@/firebase/dayCycle";
import { useAuth } from "@/firebase/authProvider";
import { useCartStore } from "@/store/useCartStore";
import Button from "@/components/ui/Button";
import { FaPowerOff, FaTriangleExclamation } from "react-icons/fa6";

export default function EndDay() {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCartStore();

  if (!user) return null;

  async function handleEnd() {
    const value = Number(amount);

    if (Number.isNaN(value)) {
      setError("Enter a valid closing balance.");
      return;
    }

    if (value < 0) {
      setError("Closing balance cannot be negative.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await endDay({
        uid: user.uid,
        closingBalance: value,
      });

      clearCart();
      setAmount("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to end the day.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const currency = profile?.nextillApp.settings.currency ?? "EUR";

  return (
    <section
      aria-labelledby="end-day-title"
      className="space-y-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4"
    >
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300">
            <FaTriangleExclamation className="text-sm" aria-hidden="true" />
          </span>

          <h2 id="end-day-title" className="text-lg font-semibold tracking-tight">
            End day
          </h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Close the POS for today. This will stop new orders until a new day is started.
        </p>
      </header>

      <div className="space-y-2">
        <label htmlFor="closing-balance" className="text-sm font-medium">
          Closing balance
        </label>

        <input
          id="closing-balance"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder={`0.00 ${currency}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-2xl border border-default bg-surface-1 px-3 py-3 text-sm outline-none"
          aria-describedby="end-day-help end-day-error"
        />

        <p id="end-day-help" className="text-xs text-muted-foreground">
          Enter the cash count or final balance before closing.
        </p>
      </div>

      {error ? (
        <p id="end-day-error" className="text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        variant="danger"
        loading={loading}
        loadingText="Ending day..."
        onClick={handleEnd}
        className="w-full justify-center"
      >
        <FaPowerOff className="text-sm" aria-hidden="true" />
        <span>End day</span>
      </Button>
    </section>
  );
}