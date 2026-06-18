import type {Timestamp} from "firebase/firestore";
import type { ChangeEventHandler } from "react";


export type StockCategory = "food" | "drink" | "packaging" | "disposableItems" | "cleaningSupplies" | "other";
export type StockAction = "add" | "remove" | "archive";
export type DraftStockCategory = StockCategory | "";

export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  quantity: number;
  unit: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  minQty: number;
  active?: boolean;
  archivedAt?: Timestamp
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
  category: DraftStockCategory;
  quantity: number;
  unit: string;
  minQty?: number;  
};

export type StockFormProps = {
  uid: string;
};

export type StockActivityListProps = {
  activity: StockActivity[];
  onDelete: (activityId: string) => void;
  onClearAll: () => void;
  loadingClearActivity: boolean
};

export type StockActivityItemProps = {
  activity: StockActivity;
  onDelete: (activityId: string) => void;
  loading?: boolean;
}

export type StockListProps = {
  uid: string;
  items: StockItem[];
}

export type StockItemProps = {
  uid: string;
  item: StockItem;
}

export type StockThresholdEditProps = {
  minQty: number;
  setMinQty: ChangeEventHandler<HTMLInputElement>;
  handleSave: () => void | Promise<void>;
  handleCancel: () => void;
  savingThreshold: boolean;
  className: string;
}