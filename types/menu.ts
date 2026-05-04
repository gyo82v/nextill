import type {Timestamp} from "firebase/firestore";
import type { StockItem } from "@/firebase/stock";

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

export type IngredientRow = {
  stockId: string;
  quantity: number;
};

export type AddItemToMenuProps = {
  currency: string;
  stockItems: StockItem[];

  name: string;
  setName: (value: string) => void;

  priceDisplay: string;
  setPriceDisplay: (value: string) => void;

  category: MenuCategory;
  setCategory: (value: MenuCategory) => void;

  ingredientRows: IngredientRow[];
  onAddIngredient: (ingredient: IngredientRow) => void;
  removeIngredientRow: (index: number) => void;

  onSave: () => void;
};
