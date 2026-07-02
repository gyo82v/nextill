import type { MenuItem } from "@/types";
import type { Discount } from "./discount";

export type CartItem = {
    name: string;
    priceMinor: number;
    quantity: number;
    id: string
}

export type CartItemRowProps = {
    item: CartItem;
    onAdd: () => void;
    onRemove: () => void;
}

export type CartPanelProps = {
  items: CartItem[];
  totalMinor: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
};

export type CheckoutItem = {
  name: string;
  priceMinor: number;
  quantity: number;
  id: string;
  menu: MenuItem;
  category?: string
}

export type CheckoutButtonProps = {
  items: CheckoutItem[];
  totalMinor: number;
  onSuccess: () => void;
};

export type CheckoutModalProps = {
  open: boolean;
  success: boolean;
  items: CheckoutItem[];
  totalMinor: number;
  loading?: boolean;
  error?: string | null;
  ticketEnabled?: boolean;
  receiptEnabled?: boolean;
  appliedDiscount: Discount |null;
  discountEnabled: boolean
  paymentEnabled: boolean;
  paymentMethod: "cash" | "card" | null;
  onPaymentMethodChange: React.Dispatch<React.SetStateAction<"cash" | "card" | null>>;
  onDiscountChange: React.Dispatch<React.SetStateAction<Discount | null>>;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  onPrintStaffTicket: () => void | Promise<void>;
  onPrintReceipt: () => void | Promise<void>;
};

export type MenuItemCardProps = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  categoryLabel?: string;
  categoryIcon?: React.ReactNode;
};

export type MenuListPosProps = {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
};

export type MobileCartBarProps = {
  itemCount: number;
  totalMinor: number;
  onOpen: () => void;
};

export type MobileCartDrawerProps = {
  open: boolean;
  onClose: () => void;

  items: CartItem[];
  checkoutItems: CheckoutItem[];

  totalMinor: number;

  onAdd: (id: string) => void;
  onRemove: (id: string) => void;

  onSuccess: () => void;
};

export type ReceiptOptions = {
  items: CheckoutItem[];
  totalMinor: number;
  currency: string;
};

export type StaffTicketOptions = {
  ticketNumber: string;
  items: CheckoutItem[];
};