import type { Discount } from "@/types/discount";

export function applyDiscount(
  subtotalMinor: number,
  discount: Discount | null
): number {
  if (!discount) return subtotalMinor;

  if (discount.type === "percentage") {
    const amount = Math.round(
      subtotalMinor * (discount.percentage / 100)
    );
    return Math.max(0, subtotalMinor - amount);
  }

  // fixed
  return Math.max(0, subtotalMinor - discount.valueMinor);
}