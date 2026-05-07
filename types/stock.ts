import type {Timestamp} from "firebase/firestore";


export type StockCategory = "food" | "drink";
export type StockAction = "add" | "remove";

export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  quantity: number;
  unit: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  minQty: number;
}

export interface StockActivity {
  id: string;
  stockId: string;
  itemName: string;
  action: StockAction;
  quantityDelta: number;
  quantityBefore: number;
  quantityAfter: number;
  createdAt: Timestamp;
}

export type CreateStockItemInput = {
  name: string;
  category: StockCategory;
  quantity: number;
  unit: string;
  minQty?: number;  
};