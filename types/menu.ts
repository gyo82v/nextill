import {
  type Timestamp,
} from "firebase/firestore";

export type MenuCategory = "food" | "drink";

export interface MenuIngredient {
  stockId: string;
  quantity: number;
}

export interface MenuItem {
  id: string;
  name: string;
  priceMinor: number;
  category: MenuCategory;
  ingredients: MenuIngredient[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
