"use client";

import { useState } from "react";
import { endDay } from "@/firebase/dayCycle";
import { useAuth } from "@/firebase/authProvider";
import { useCartStore } from "@/store/useCartStore";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import { FaPowerOff, FaTriangleExclamation } from "react-icons/fa6";
import { inputBaseStyle } from "@/styles";
import { moneyToMinorUnits } from "@/lib/money";
import { useTranslation } from "react-i18next";

export default function EndDay({ device }: { device: "mobile" | "desktop" }) {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCartStore();
  const balanceEnabled = profile?.nextillApp?.settings?.balanceEnabled ?? false;
  const { t } = useTranslation("pos");

  if (!user) return null;

  async function handleEnd() {
    if (!user) return;

    let closingBalanceMinor = 0;

    if (balanceEnabled) {
      const parsed = moneyToMinorUnits(amount);

      if (parsed === null) {
        setError(t("endDay.balanceError"));
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
      setIsConfirmOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("endDay.endDayError");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const currency = profile?.nextillApp.settings.currency ?? "EUR";

  return (
    <>
      <section
        aria-labelledby="end-day-title"
        className="space-y-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4"
      >
        <header className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full
                         border border-red-500/20 bg-red-500/10 text-red-600
                         dark:text-red-300"
            >
              <FaTriangleExclamation className="text-sm" aria-hidden="true" />
            </span>

            <h2
              id="end-day-title"
              className="text-lg font-semibold tracking-tight"
            >
              {t("endDay.title")}
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">
            {t("endDay.description")}
          </p>
        </header>

        {balanceEnabled && (
          <div className="space-y-2">
            <label
              htmlFor={
                device === "mobile"
                  ? "closing-balance-mobile"
                  : "closing-balance-desktop"
              }
              className="text-sm font-medium"
            >
              {t("endDay.balanceTitle")}
            </label>

            <input
              id={
                device === "mobile"
                  ? "closing-balance-mobile"
                  : "closing-balance-desktop"
              }
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
              {t("endDay.balanceDescription")}
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
          loadingText={t("endDay.buttonLoading")}
          onClick={() => setIsConfirmOpen(true)}
          className="w-full justify-center"
          disabled={balanceEnabled && !amount.trim()}
        >
          <FaPowerOff className="text-sm" aria-hidden="true" />
          <span>{t("endDay.button")}</span>
        </Button>
      </section>

      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => {
          if (!loading) setIsConfirmOpen(false);
        }}
        onConfirm={handleEnd}
        title={t("endDay.confirmTitle")}
        description={t("endDay.confirmDescription")}
        confirmLabel={t("endDay.confirmButton")}
        cancelLabel={t("endDay.cancelButton")}
        loading={loading}
        danger
      />
    </>
  );
}

