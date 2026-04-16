export type StockCategory = "food" | "drink";

export interface StockItem {
  id: string;          // Firestore doc id
  name: string;
  category: StockCategory;
  quantity: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

export type StockAction = "add" | "remove";

export interface StockActivity {
  id: string;
  stockId: string;
  itemName: string;
  action: StockAction;
  quantityDelta: number;     // signed integer
  quantityBefore: number;
  quantityAfter: number;
  createdAt: Date;
}