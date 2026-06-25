import type { Timestamp } from "firebase/firestore";

export type Discount =
  | {
      id: string;
      name: string;
      type: "percentage";
      percentage: number;
      active: boolean;
      createdAt: Timestamp;
      updatedAt: Timestamp;
    }
  | {
      id: string;
      name: string;
      type: "flat";
      valueMinor: number;
      active: boolean;
      createdAt: Timestamp;
      updatedAt: Timestamp;
    };

export type CreateDiscountInput =
  | {
      name: string;
      type: "percentage";
      percentage: number;
      active?: boolean;
    }
  | {
      name: string;
      type: "flat";
      valueMinor: number;
      active?: boolean;
    };

export type UpdateDiscountInput =
  | {
      name?: string;
      type: "percentage";
      percentage?: number;
      active?: boolean;
    }
  | {
      name?: string;
      type: "flat";
      valueMinor?: number;
      active?: boolean;
    };