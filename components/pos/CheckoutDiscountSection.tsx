"use client";

import { useEffect, useState } from "react";
import { listActiveDiscounts } from "@/firebase/discount";
import type { Discount } from "@/types/discount";
import Button from "@/components/ui/Button";

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

  return (
    <div className="space-y-2 rounded-2xl border border-default bg-surface-2 p-4">
      <p className="text-sm font-medium">Discounts</p>

      <div className="space-y-2">
        {discounts.map((discount) => {
          const selected = appliedDiscount?.id === discount.id;

          const label =
            discount.type === "percentage"
              ? `-${discount.percentage}%`
              : `-€${(discount.valueMinor / 100).toFixed(2)}`;

          return (
            <Button
              key={discount.id}
              type="button"
              variant={selected ? "confirm" : "secondary"}
              onClick={() =>
                onDiscountChange(selected ? null : discount)
              }
              className="w-full justify-between"
            >
              <span>{discount.name}</span>
              <span className="text-sm">{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}