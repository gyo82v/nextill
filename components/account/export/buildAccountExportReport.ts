import type { AccountExportReport, BuildAccountExportReportInput, DailyTotals } from "@/types";

function formatDateTime(value: unknown) {
  const date = toDate(value);
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-GB").format(value);
}

function safeText(value?: string | null, fallback = "—") {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function toDate(value: unknown) {
  if (!value) return null;

  if (value instanceof Date) return value;

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const maybeToDate = value as { toDate?: () => Date };
    if (typeof maybeToDate.toDate === "function") {
      const date = maybeToDate.toDate();
      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  return null;
}

function countArchived<T extends { active?: boolean | null }>(items: T[]) {
  return items.reduce((total, item) => total + (item.active === false ? 1 : 0), 0);
}

function groupByCategory<T extends { category?: string | null; active?: boolean | null; minQty?: number | null; quantity?: number | null }>(
  items: T[]
) {
  const map = new Map<
    string,
    { totalItems: number; activeItems: number; archivedItems: number; lowStockItems: number }
  >();

  for (const item of items) {
    const name = safeText(item.category, "Uncategorized");
    const archived = item.active === false;
    const lowStock =
      typeof item.minQty === "number" && typeof item.quantity === "number"
        ? item.quantity <= item.minQty
        : false;

    const current = map.get(name) ?? {
      totalItems: 0,
      activeItems: 0,
      archivedItems: 0,
      lowStockItems: 0,
    };

    current.totalItems += 1;
    if (archived) current.archivedItems += 1;
    else current.activeItems += 1;
    if (lowStock) current.lowStockItems += 1;

    map.set(name, current);
  }

  return Array.from(map.entries())
    .map(([name, counts]) => ({ name, ...counts }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function buildAccountExportReport(
  input: BuildAccountExportReportInput
): AccountExportReport {
  const exportedAt = formatDateTime(input.exportedAt ?? new Date());

  const menuArchivedItems = countArchived(input.menuItems);
  const stockArchivedItems = countArchived(input.stockItems);
  const menuCategories = groupByCategory(input.menuItems);
  const stockCategories = groupByCategory(input.stockItems);
  const lowStockItems = input.stockItems.reduce((total, item) => {
    const isLowStock =
      typeof item.minQty === "number" && typeof item.quantity === "number"
        ? item.quantity <= item.minQty
        : false;
    return total + (isLowStock ? 1 : 0);
  }, 0);

  const sortedDailySummaries = [...input.dailySummaries].sort((a, b) => {
    const aDate = toDate(a.updatedAt ?? a.date);
    const bDate = toDate(b.updatedAt ?? b.date);
    return (bDate?.getTime() ?? 0) - (aDate?.getTime() ?? 0);
  });

  const dailyTotals = input.dailySummaries.reduce<DailyTotals>(
    (acc, summary) => {
      acc.earnings += summary.earnings ?? 0;
      acc.transactions += summary.transactions ?? 0;
      return acc;
    },
    { earnings: 0, transactions: 0 }
  );

  const recentSummaries = sortedDailySummaries.slice(0, 5).map((summary) => ({
    date: safeText(summary.date),
    earnings: formatNumber(summary.earnings),
    transactions: formatNumber(summary.transactions),
  }));

  const mostRecentSummary = sortedDailySummaries[0];

  const sortedStockActivity = [...input.stockActivity].sort((a, b) => {
    const aDate = toDate(a.createdAt);
    const bDate = toDate(b.createdAt);
    return (bDate?.getTime() ?? 0) - (aDate?.getTime() ?? 0);
  });

  const recentActivities = sortedStockActivity.slice(0, 5).map((activity) => ({
    createdAt: formatDateTime(activity.createdAt),
    action: safeText(activity.action),
    itemName: safeText(activity.itemName),
    quantityDelta: formatNumber(activity.quantityDelta),
    quantityAfter: formatNumber(activity.quantityAfter),
  }));

  return {
    exportedAt,
    user: {
      email: safeText(input.user.email),
      username: safeText(input.user.username),
      createdAt: formatDateTime(input.user.createdAt),
      emailConfirmed: Boolean(input.user.emailConfirmed),
    },
    settings: {
      dayActive: Boolean(input.settings.dayActive),
      dayDate: safeText(input.settings.dayDate),
      language: safeText(input.settings.language),
      currency: safeText(input.settings.currency),
      darkMode: Boolean(input.settings.darkMode),
      staffTicketPrinting: Boolean(input.settings.ticketEnabled),
      receiptPrinting: Boolean(input.settings.receiptEnabled),
      balanceEnabled: Boolean(input.settings.balanceEnabled),
      motionReduced: Boolean(input.settings.disableMotion),
      dayCycle: {
        startedAt: formatDateTime(input.dayCycle.startedAt),
        endedAt: formatDateTime(input.dayCycle.endedAt),
        openingBalance: formatNumber(input.dayCycle.openingBalance),
        closingBalance: formatNumber(input.dayCycle.closingBalance),
        dayKey: safeText(input.dayCycle.dayKey),
        nextTicketNumber: formatNumber(input.dayCycle.nextTicketNumber),
      },
      statistics: {
        totalEarnings: formatNumber(input.statistics.totalEarnings),
        totalTransactions: formatNumber(input.statistics.totalTransactions),
        unitsSoldTotal: formatNumber(input.statistics.unitsSoldTotal),
        lastSaleAt: formatDateTime(input.statistics.lastSaleAt),
      },
    },
    menu: {
      totalItems: input.menuItems.length,
      activeItems: input.menuItems.length - menuArchivedItems,
      archivedItems: menuArchivedItems,
      categories: menuCategories,
    },
    stock: {
      totalItems: input.stockItems.length,
      activeItems: input.stockItems.length - stockArchivedItems,
      archivedItems: stockArchivedItems,
      lowStockItems,
      categories: stockCategories,
    },
    dailySummaries: {
      totalSummaries: input.dailySummaries.length,
      dateRange:
        sortedDailySummaries.length > 0
          ? `${safeText(sortedDailySummaries[sortedDailySummaries.length - 1].date)} to ${safeText(sortedDailySummaries[0].date)}`
          : "—",
      totalEarnings: formatNumber(dailyTotals.earnings),
      totalTransactions: formatNumber(dailyTotals.transactions),
      mostRecentSummary: mostRecentSummary ? safeText(mostRecentSummary.date) : "—",
      recentSummaries,
    },
    stockActivity: {
      totalEntries: input.stockActivity.length,
      lastActivity: recentActivities[0]?.createdAt ?? "—",
      recentActivities,
    },
  };
}

