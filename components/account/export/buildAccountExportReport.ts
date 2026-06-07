import type { AccountExportReport } from "@/components/account/export/AccountExportPdf";

export type RawMenuItemForExport = {
  name?: string | null;
  category?: string | null;
  archived?: boolean | null;
};

export type RawStockItemForExport = {
  name?: string | null;
  archived?: boolean | null;
};

export type RawReportForExport = {
  createdAt?: string | number | Date | null;
  totalSales?: number | null;
  totalOrders?: number | null;
  totalDiscounts?: number | null;
  totalTaxes?: number | null;
};

export type BuildAccountExportReportInput = {
  exportedAt?: Date;
  user: {
    email?: string | null;
    username?: string | null;
    emailConfirmed?: boolean | null;
  };
  settings: {
    dayActive?: boolean | null;
    language?: string | null;
    currency?: string | null;
    staffTicketPrinting?: boolean | null;
    receiptPrinting?: boolean | null;
    balanceEnabled?: boolean | null;
    motionReduced?: boolean | null;
  };
  menuItems: RawMenuItemForExport[];
  stockItems: RawStockItemForExport[];
  reports: RawReportForExport[];
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatDateOnly(value: string | number | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(date);
}

function safeText(value?: string | null, fallback = "—") {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function isArchived(value?: boolean | null) {
  return Boolean(value);
}

function addTotals(
  acc: { sales: number; orders: number; discounts: number; taxes: number },
  report: RawReportForExport
) {
  acc.sales += report.totalSales ?? 0;
  acc.orders += report.totalOrders ?? 0;
  acc.discounts += report.totalDiscounts ?? 0;
  acc.taxes += report.totalTaxes ?? 0;
}

export function buildAccountExportReport(
  input: BuildAccountExportReportInput
): AccountExportReport {
  const exportedAt = formatDateTime(input.exportedAt ?? new Date());

  const menuCategories = new Map<
    string,
    { totalItems: number; activeItems: number; archivedItems: number }
  >();

  let menuArchivedItems = 0;
  let stockArchivedItems = 0;

  for (const item of input.menuItems) {
    const categoryName = safeText(item.category, "Uncategorized");
    const archived = isArchived(item.archived);

    const current = menuCategories.get(categoryName) ?? {
      totalItems: 0,
      activeItems: 0,
      archivedItems: 0,
    };

    current.totalItems += 1;
    if (archived) {
      current.archivedItems += 1;
      menuArchivedItems += 1;
    } else {
      current.activeItems += 1;
    }

    menuCategories.set(categoryName, current);
  }

  for (const item of input.stockItems) {
    if (isArchived(item.archived)) {
      stockArchivedItems += 1;
    }
  }

  const sortedCategories = Array.from(menuCategories.entries())
    .map(([name, counts]) => ({ name, ...counts }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const reportTotals = input.reports.reduce(
    (acc, report) => {
      addTotals(acc, report);
      return acc;
    },
    { sales: 0, orders: 0, discounts: 0, taxes: 0 }
  );

  const mostRecentReport =
    input.reports.length > 0
      ? input.reports
          .map((report) => report.createdAt)
          .filter((value): value is string | number | Date => value !== null && value !== undefined)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
      : null;

  const dateRange =
    input.reports.length > 0
      ? (() => {
          const dates = input.reports
            .map((report) => report.createdAt)
            .filter((value): value is string | number | Date => value !== null && value !== undefined)
            .map((value) => new Date(value))
            .filter((date) => !Number.isNaN(date.getTime()))
            .sort((a, b) => a.getTime() - b.getTime());

          if (dates.length === 0) return "—";

          const first = dates[0];
          const last = dates[dates.length - 1];
          return `${formatDateOnly(first)} to ${formatDateOnly(last)}`;
        })()
      : "—";

  return {
    exportedAt,
    user: {
      email: safeText(input.user.email),
      username: safeText(input.user.username),
      emailConfirmed: Boolean(input.user.emailConfirmed),
    },
    settings: {
      dayActive: Boolean(input.settings.dayActive),
      language: safeText(input.settings.language, "—"),
      currency: safeText(input.settings.currency, "—"),
      staffTicketPrinting: Boolean(input.settings.staffTicketPrinting),
      receiptPrinting: Boolean(input.settings.receiptPrinting),
      balanceEnabled: Boolean(input.settings.balanceEnabled),
      motionReduced: Boolean(input.settings.motionReduced),
    },
    menu: {
      totalItems: input.menuItems.length,
      activeItems: input.menuItems.length - menuArchivedItems,
      archivedItems: menuArchivedItems,
      categories: sortedCategories,
    },
    stock: {
      totalItems: input.stockItems.length,
      activeItems: input.stockItems.length - stockArchivedItems,
      archivedItems: stockArchivedItems,
    },
    reports: {
      totalReports: input.reports.length,
      dateRange,
      mostRecentReport: mostRecentReport ? formatDateOnly(mostRecentReport) : "—",
      totalSales: reportTotals.sales,
      totalOrders: reportTotals.orders,
      totalDiscounts: reportTotals.discounts,
      totalTaxes: reportTotals.taxes,
    },
  };
}
