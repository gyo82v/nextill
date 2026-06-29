"use client";

import { useEffect, useState } from "react";
import { listActiveDiscounts } from "@/firebase/discount";
import type { Discount } from "@/types/discount";
import Select from "../ui/select";
import { useTranslation } from "react-i18next";

type CheckoutDiscountSectionProps = {
  uid: string;
  discountEnabled: boolean;
  appliedDiscount: Discount | null;
  onDiscountChange: (discount: Discount | null) => void;
};

export default function CheckoutDiscountSection({
  uid,
  discountEnabled,
  appliedDiscount,
  onDiscountChange,
}: CheckoutDiscountSectionProps) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation("pos")

  useEffect(() => {
    if (!discountEnabled) return;

    let mounted = true;

    (async () => {
      setLoading(true);

      try {
        const data = await listActiveDiscounts(uid);
        if (mounted) setDiscounts(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [uid, discountEnabled]);

  if (!discountEnabled || loading || discounts.length === 0) {
    return null;
  }

  const formatLabel = (discount: Discount) => {
    return discount.type === "percentage"
      ? `${discount.percentage}%`
      : `€${(discount.valueMinor / 100).toFixed(2)}`;
  };

  const selectedValue = appliedDiscount?.id ?? "none";

  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-default bg-surface-2 p-4">
      <p className="text-sm font-medium">
        {t("discount.title")}
      </p>

      <Select.Root
        value={selectedValue}
        className="w-full"
        onValueChange={(value) => {
          if (value === "none") {
            onDiscountChange(null);
            return;
          }

          const selected = discounts.find((d) => d.id === value);
          if (selected) {
            onDiscountChange(selected);
          }
        }}
      >
        {/* TRIGGER */}
        <Select.Trigger
          label="Apply discount"
          placeholder="No discount"
          className="w-full"
        >
          {appliedDiscount ? (
            <div className="flex flex-col items-start">
              <span className="font-medium">{appliedDiscount.name}</span>
              <span className="text-sm text-muted-foreground">
                {formatLabel(appliedDiscount)}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {t("discount.noDiscount")}
            </span>
          )}
        </Select.Trigger>

        {/* CONTENT */}
        <Select.Content>
          {/* NO DISCOUNT OPTION */}
          <Select.Item value="none">
            <div className="flex flex-col">
              <span>{t("discount.noDiscount")}</span>
              <span className="text-sm text-muted-foreground">
                {t("discount.noDiscountDescription")}
              </span>
            </div>
          </Select.Item>

          {/* DIVIDER (optional styling inside your Select component) */}

          {discounts.map((discount) => (
            <Select.Item key={discount.id} value={discount.id}>
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="font-medium">{discount.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatLabel(discount)}
                  </span>
                </div>
              </div>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}
