import type { ReactNode } from "react";
import type { User } from "firebase/auth";

export type DataManagementAction =
  | "clearReports"
  | "deleteArchivedItems"
  | "deleteArchivedMenuItems"
  | "deleteArchivedStockItems"
  | "resetAllData";

export type DataManagementSectionProps = {
  dayActive: boolean;
  onClearReports?: () => Promise<void>;
  onDeleteArchivedItems?: () => Promise<void>;
  onDeleteArchivedMenuItems?: () => Promise<void>;
  onDeleteArchivedStockItems?: () => Promise<void>;
  onResetAllData?: () => Promise<void>;
};

export type FeedbackState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export type ActionConfig = {
  title: string;
  description: string;
  buttonLabel: string;
  confirmLabel: string;
  successMessage: string;
  handler?: () => Promise<void>;
};

export type DangerActionRowProps = {
  title: string;
  description: string;
  buttonLabel: string;
  onClick?: () => void;
  disabled?: boolean;
}

export type SecuritySectionProps = {
  onResetPassword: () => Promise<void>;
  onDeleteAccount: (password: string) => Promise<void>;
  dayActive: boolean;
};

export type PreferencesSectionProps = {
  currency: string;
  onCurrencyChange: (newCurrency: string) => void;

  reduceMotion?: boolean;
  onReduceMotionChange?: (nextValue: boolean) => void;

  staffTicketPrinting?: boolean;
  onStaffTicketPrintingChange?: (nextValue: boolean) => void;

  receiptPrinting?: boolean;
  onReceiptPrintingChange?: (nextValue: boolean) => void;

  balanceEnabled?: boolean;
  onBalanceEnabledChange?: (nextValue: boolean) => void;

  soundEnabled?: boolean;
  onSoundEnabledChange?: (nextValue: boolean) => void;

  discountEnabled?: boolean;
  onDiscountEnabledChange?: (nextValue: boolean) => void;

  dayActive?: boolean
};

export type SettingRowProps = {
  label: string;
  description: string;
  children: ReactNode;
  disabled?: boolean
};

export type ExportDataSectionProps = {
  onExportPdf: () => Promise<void>;
  onExportBackup: () => Promise<void>;
};

export type AccountExportReport = {
  exportedAt: string;
  user: {
    email: string;
    username: string;
    createdAt: string;
    emailConfirmed: boolean;
  };
  settings: {
    dayActive: boolean;
    dayDate: string;
    language: string;
    currency: string;
    darkMode: boolean;
    staffTicketPrinting: boolean;
    receiptPrinting: boolean;
    balanceEnabled: boolean;
    motionReduced: boolean;
    dayCycle: {
      startedAt: string;
      endedAt: string;
      openingBalance: string;
      closingBalance: string;
      dayKey: string;
      nextTicketNumber: string;
    };
    statistics: {
      totalEarnings: string;
      totalTransactions: string;
      unitsSoldTotal: string;
      lastSaleAt: string;
    };
  };
  menu: {
    totalItems: number;
    activeItems: number;
    archivedItems: number;
    categories: Array<{
      name: string;
      totalItems: number;
      activeItems: number;
      archivedItems: number;
    }>;
  };
  stock: {
    totalItems: number;
    activeItems: number;
    archivedItems: number;
    lowStockItems: number;
    categories: Array<{
      name: string;
      totalItems: number;
      activeItems: number;
      archivedItems: number;
      lowStockItems: number;
    }>;
  };
  dailySummaries: {
    totalSummaries: number;
    dateRange: string;
    totalEarnings: string;
    totalTransactions: string;
    mostRecentSummary: string;
    recentSummaries: Array<{
      date: string;
      earnings: string;
      transactions: string;
    }>;
  };
  stockActivity: {
    totalEntries: number;
    lastActivity: string;
    recentActivities: Array<{
      createdAt: string;
      action: string;
      itemName: string;
      quantityDelta: string;
      quantityAfter: string;
    }>;
  };
};

export type AccountExportPdfProps = {
  data: AccountExportReport;
};

export type RawMenuItemForExport = {
  category?: string | null;
  active?: boolean | null;
  createdAt?: unknown;
  updatedAt?: unknown;
  archivedAt?: unknown;
  name?: string | null;
  priceMinor?: number | null;
};

export type RawStockItemForExport = {
  category?: string | null;
  active?: boolean | null;
  createdAt?: unknown;
  updatedAt?: unknown;
  archivedAt?: unknown;
  name?: string | null;
  quantity?: number | null;
  unit?: string | null;
  minQty?: number | null;
};

export type RawDailySummaryForExport = {
  date?: string | null;
  earnings?: number | null;
  transactions?: number | null;
  updatedAt?: unknown;
};

export type RawStockActivityForExport = {
  action?: string | null;
  createdAt?: unknown;
  itemName?: string | null;
  quantityBefore?: number | null;
  quantityAfter?: number | null;
  quantityDelta?: number | null;
  stockId?: string | null;
};

export type BuildAccountExportReportInput = {
  exportedAt?: Date;
  user: {
    email?: string | null;
    username?: string | null;
    createdAt?: unknown;
    emailConfirmed?: boolean | null;
  };
  settings: {
    dayActive?: boolean | null;
    dayDate?: string | null;
    language?: string | null;
    currency?: string | null;
    darkMode?: boolean | null;
    balanceEnabled?: boolean | null;
    ticketEnabled?: boolean | null;
    receiptEnabled?: boolean | null;
    disableMotion?: boolean | null;
  };
  dayCycle: {
    startedAt?: unknown | null;
    endedAt?: unknown | null;
    openingBalance?: number | null;
    closingBalance?: number | null;
    dayKey?: string | null;
    nextTicketNumber?: number | null;
  };
  statistics: {
    itemsSales?: Record<string, number> | null;
    lastSaleAt?: unknown;
    totalEarnings?: number | null;
    totalTransactions?: number | null;
    unitsSoldTotal?: number | null;
  };
  menuItems: RawMenuItemForExport[];
  stockItems: RawStockItemForExport[];
  dailySummaries: RawDailySummaryForExport[];
  stockActivity: RawStockActivityForExport[];
};

export type DailyTotals = {
  earnings: number;
  transactions: number;
};

export type AccountOverviewSectionProps = {
  user: Pick<User, "email" | "emailVerified"> | null;
  profile: {
    email?: string | null;
    displayName?: string | null;
    nextillApp?: {
      dayCycle?: {
        active?: boolean | null;
      } | null;
      settings?: {
        ticketEnabled?: boolean | null;
        receiptEnabled?: boolean | null;
        balanceEnabled?: boolean | null;
      } | null;
    } | null;
  } | null;
};

export type Row = {
  label: string;
  value: string;
};

export type ExportRowProps = {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  loading?: boolean;
}

export type ExportUserDataResult = {
  user: {
    email?: string | null;
    username?: string | null;
    createdAt?: unknown;
    emailConfirmed?: boolean | null;
  };
  settings: {
    dayActive?: boolean | null;
    dayDate?: string | null;
    language?: string | null;
    currency?: string | null;
    darkMode?: boolean | null;
    balanceEnabled?: boolean | null;
    ticketEnabled?: boolean | null;
    receiptEnabled?: boolean | null;
    disableMotion?: boolean | null;
  };
  dayCycle: {
    startedAt?: unknown | null;
    endedAt?: unknown | null;
    openingBalance?: number | null;
    closingBalance?: number | null;
    dayKey?: string | null;
    nextTicketNumber?: number | null;
  };
  statistics: {
    itemsSales?: Record<string, number> | null;
    lastSaleAt?: unknown;
    totalEarnings?: number | null;
    totalTransactions?: number | null;
    unitsSoldTotal?: number | null;
  };
  menuItems: RawMenuItemForExport[];
  stockItems: RawStockItemForExport[];
  dailySummaries: RawDailySummaryForExport[];
  stockActivity: RawStockActivityForExport[];
};

export type AccountSectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};
