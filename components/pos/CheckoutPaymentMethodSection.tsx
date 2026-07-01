"use client";

import Select from "../ui/select";
import { useTranslation } from "react-i18next";

export type PaymentMethod = "cash" | "card" | null;

type CheckoutPaymentMethodSectionProps = {
  enabled: boolean;
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
};

export default function CheckoutPaymentMethodSection({
  enabled,
  value,
  onChange,
}: CheckoutPaymentMethodSectionProps) {
  const { t } = useTranslation("pos");

  if (!enabled) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-default bg-surface-2 p-4">
      <p className="text-sm font-medium">
        {t("payment.title")}
      </p>

      <Select.Root
        value={value ?? ""}
        className="w-full"
        onValueChange={(val) => onChange(val as PaymentMethod)}
      >
        {/* TRIGGER */}
        <Select.Trigger
          label={t("payment.label")}
          placeholder={t("payment.placeholder")}
          className="w-full"
        >
          {value ? (
            <span className="font-medium">
              {t(`payment.methods.${value}`)}
            </span>
          ) : (
            <span className="text-muted-foreground">
              {t("payment.placeholder")}
            </span>
          )}
        </Select.Trigger>

        {/* CONTENT */}
        <Select.Content>
          <Select.Item value="cash">
            <span>{t("payment.methods.cash")}</span>
          </Select.Item>

          <Select.Item value="card">
            <span>{t("payment.methods.card")}</span>
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}