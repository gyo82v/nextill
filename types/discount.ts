import type { Timestamp } from "firebase/firestore";

/**
 * Discount type used when READING from Firestore
 */
export type Discount = {
  id: string;
  name: string;
  type: "fixed" | "percentage";
  value: number;
  active?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  archivedAt?: Timestamp;
};

/**
 * Input type for CREATING a discount
 * (timestamps are handled internally by Firebase helpers)
 */
export type CreateDiscountInput = {
  name: string;
  type: "fixed" | "percentage";
  value: number;
  active?: boolean;
};

/**
 * Input type for UPDATING a discount
 */
export type UpdateDiscountInput = {
  name?: string;
  type?: "fixed" | "percentage";
  value?: number;
  active?: boolean;
};