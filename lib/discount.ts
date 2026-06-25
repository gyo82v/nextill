import type { Discount } from "@/types/discount";

export function applyDiscount(
  totalMinor: number,
  discount: Discount
): number {
  if (discount.type === "fixed") {
    return Math.max(0, totalMinor - discount.value);
  }

  if (discount.type === "percentage") {
    return Math.round(totalMinor * (1 - discount.value / 100));
  }

  return totalMinor;
}