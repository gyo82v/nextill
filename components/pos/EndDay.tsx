"use client";

import { useState } from "react";
import { endDay } from "@/firebase/dayCycle";
import { useAuth } from "@/firebase/authProvider";
import { useCartStore } from "@/store/useCartStore";
import Button from "@/components/ui/Button";
import { FaPowerOff, FaTriangleExclamation } from "react-icons/fa6";
import {inputBaseStyle} from "@/styles";

function moneyToMinorUnits(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) return null;

  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;

  return Math.round(value * 100);
}

export default function EndDay() {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCartStore();
  const balanceEnabled = profile?.nextillApp?.settings?.balanceEnabled ?? false;

  if (!user) return null;

  async function handleEnd() {
    if (!user) return;

    let closingBalanceMinor = 0;

    if (balanceEnabled) {
      const parsed = moneyToMinorUnits(amount);

      if (parsed === null) {
        setError("Enter a valid closing balance.");
        return;
      }

      closingBalanceMinor = parsed;
    }

    setLoading(true);
    setError(null);

    try {
      await endDay({
        uid: user.uid,
        closingBalance: closingBalanceMinor,
      });

      clearCart();
      setAmount("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to end the day.";
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
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full
                            border border-red-500/20 bg-red-500/10 text-red-600
                           dark:text-red-300`}>
            <FaTriangleExclamation className="text-sm" aria-hidden="true" />
          </span>

          <h2 id="end-day-title" className="text-lg font-semibold tracking-tight">
            End day
          </h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Close the POS for today. This will stop new orders until a new day is
          started.
        </p>
      </header>

      {balanceEnabled && (
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
            className={`${inputBaseStyle} w-full`}
            aria-describedby="end-day-help end-day-error"
            aria-invalid={Boolean(error)}
          />

          <p id="end-day-help" className="text-xs text-muted-foreground">
            Enter the cash count or final balance before closing.
          </p>
        </div>
      )}

      {error ? (
        <p
          id="end-day-error"
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
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
