import type { ReactNode } from "react";

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
};

export type SettingRowProps = {
  label: string;
  description: string;
  children: ReactNode;
};
