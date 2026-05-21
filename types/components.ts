export type CurrencyCode = "EUR" | "USD" | "GBP";

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

export type MobileHeaderMenuProps = {
  open: boolean;
  onClose: () => void;
};

export type AuthDescriptionProps = {
  title: string;
  description: string;
  benefit: string;
  freeNote: string;
  cta: string;
  features?: string[];
  featuresTitle?: string;
};