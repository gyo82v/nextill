"use client";

import { useId, useState } from "react";
import { startDay } from "@/firebase/dayCycle";
import { useAuth } from "@/firebase/authProvider";
import Button from "@/components/ui/Button";
import { inputBaseStyle } from "@/styles";
import { moneyToMinorUnits } from "@/lib/money";
import { useTranslation } from "react-i18next";

export default function StartDay() {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("pos");

  const balanceEnabled = profile?.nextillApp?.settings?.balanceEnabled ?? false;
  const inputId = useId();
  const helpId = useId();
  const errorId = useId();

  if (!user) return null;

  async function handleStart() {
    if (!user) return;

    let openingBalanceMinor = 0;

    if (balanceEnabled) {
      const parsed = moneyToMinorUnits(amount);

      if (parsed === null) {
        setError(`${t("startDay.balanceError")}`);
        return;
      }

      openingBalanceMinor = parsed;
    }

    setLoading(true);
    setError(null);

    try {
      await startDay({
        uid: user.uid,
        openingBalance: openingBalanceMinor,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-6 sm:px-0">
      <div className="rounded-3xl border border-default bg-surface-1 p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("startDay.title")}
          </h1>

          <p className="text-sm leading-6 text-muted-foreground sm:text-base">
            {t("startDay.description")}
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {balanceEnabled ? (
            <div className="space-y-2">
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-foreground"
              >
                {t("startDay.balanceTitle")}
              </label>

              <p id={helpId} className="text-sm leading-6 text-muted-foreground">
                {t("startDay.balanceDescription")}
              </p>

              <input
                id={inputId}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-describedby={error ? `${helpId} ${errorId}` : helpId}
                aria-invalid={Boolean(error)}
                className={inputBaseStyle}
              />

              <p className="text-xs leading-5 text-muted-foreground">
                {t("startDay.balanceHint")}
              </p>

              {error ? (
                <p id={errorId} className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          ) : (
            <div className={`rounded-2xl border border-dashed border-default bg-background/40
                             p-4 text-sm leading-6 text-muted-foreground`}>
              {t("startDay.noBalanceDescription")}
            </div>
          )}

          <Button
            onClick={handleStart}
            type="button"
            loading={loading}
            loadingText={t("startDay.buttonLoading")}
            className="w-full"
          >
            {t("startDay.button")}
          </Button>
        </div>
      </div>
    </section>
  );
}

