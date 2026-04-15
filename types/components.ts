export type CurrencyCode = "EUR" | "USD" | "GBP";

export interface MenuItem {
  id: string;
  name: string;
  priceMinor: number; // 👈 cents
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface SaleItem {
  id: string;
  name: string;
  priceMinor: number;
  quantity: number;
}

export interface Sale {
  totalMinor: number;
  currency: CurrencyCode;
  itemCount: number;
  items: SaleItem[];
}