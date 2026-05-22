import { MenuItem } from "./menu";

export type GlobalStats = {
  totalEarnings: number;
  totalTransactions: number;
  unitsSoldTotal: number;
  itemsSales: Record<string, number>;
  lastSaleAt?: unknown;
};

export type DaySummary = {
  date: string;
  earnings: number;
  transactions: number;
  unitsSoldTotal?: number;
  itemsSales?: Record<string, number>;
  mostSoldItem?: string | null;
  updatedAt?: unknown;
};

export type DaySummaryRow = DaySummary & {
  id: string;
};

export type TransactionItem = {
  menuId: string;
  name: string;
  quantity: number;
  priceMinor: number;
};

export type TransactionDoc = {
  createdAt?: unknown;
  dayKey: string;
  totalMinor: number;
  itemCount: number;
  status: string;
  items: TransactionItem[];
};

export type TransactionRow = TransactionDoc & {
  id: string;
};

export type ReportsGlobalProps = {
  userId: string;
  currency: string;
  menuItems: MenuItem[];
};

export type ReportsCurrentDayProps = {
  userId: string;
  dayKey: string | null;
  currency: string;
  menuItems: MenuItem[];
};

export type ReportsDayOverviewProps = {
  userId: string;
  currency: string;
  menuItems: MenuItem[];
};

export type TopItemsProps = {
  items: [string, number][];
  menuNameById: Map<string, string>;
};