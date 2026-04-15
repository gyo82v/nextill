import { Timestamp } from "firebase/firestore";

export type CurrencyCode = "EUR" | "USD" | "GBP" | "AUD" | "CAD";
export type MenuCategory = "food" | "drink";
export type StockUnit = "pcs" | "g" | "kg" | "ml" | "l";
export type StockActivityType = "added" | "removed" | "updated" | "deleted";

export interface StockItem {
  id: string;
  name: string;
  qty: number;
  unit: StockUnit;
  isActive: boolean;
  minQty?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MenuIngredient {
  stockId: string;
  qtyNeeded: number;
}

export interface MenuItem {
  id: string;
  name: string;
  priceMinor: number;
  category: MenuCategory;
  ingredients: MenuIngredient[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface StockActivity {
  id: string;
  stockId: string;
  stockName: string;
  type: StockActivityType;
  deltaQty: number;
  beforeQty: number;
  afterQty: number;
  note?: string;
  createdAt: Timestamp;
}