import type {Timestamp} from "firebase/firestore";
import type {StockItem} from "@/types/stock";

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

  loading: boolean;
  onSave: () => void;
};

export type IngredientRowCardProps = {
  stockId: string;
  quantity: number;
  stockItems: StockItem[];
  onRemove: () => void;
};

export type IngredientDraft = {
  stockId: string;
  quantity: number;
};

export type IngredientDraftCardProps = {
  stockItems: StockItem[];
  onAdd: (ingredient: IngredientDraft) => void;
};

export type StockItemWithActive = StockItem & {
  active?: boolean;
};

export interface MenuIngredient {
  stockId: string;
  quantity: number;
}

export type CreateMenuItemInput = {
  name: string;
  priceMinor: number;
  category: MenuCategory;
  ingredients?: MenuIngredient[];
};

export type UpdateMenuItemInput = Partial<{
  name: string;
  priceMinor: number;
  category: MenuCategory;
  ingredients: MenuIngredient[];
}>;

export type MenuItemProps = {
  item: MenuItem;
  stockItems: StockItem[];
  currency: string;
  loading: boolean;
  onDelete: (menuId: string) => void;
};

export type MenuListProps = {
  loading: boolean;
  menuItems: MenuItem[];
  stockItems: StockItem[];
  currency: string;
  loadingDelete: boolean;
  onDelete: (menuId: string) => void;
};

