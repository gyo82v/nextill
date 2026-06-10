import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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

type AccountExportPdfProps = {
  data: AccountExportReport;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 28,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 9,
    color: "#4B5563",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: "#111827",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 8,
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  cardValue: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  label: {
    color: "#4B5563",
    width: "55%",
  },
  value: {
    fontWeight: 700,
    color: "#111827",
    width: "45%",
    textAlign: "right",
  },
  table: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 700,
    color: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 9,
    color: "#111827",
  },
  footer: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 18,
    fontSize: 8,
    color: "#6B7280",
    textAlign: "center",
  },
});

function boolText(value: boolean) {
  return value ? "Yes" : "No";
}

function onOffText(value: boolean) {
  return value ? "On" : "Off";
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function TableCell({
  children,
  width,
  alignRight = false,
}: {
  children: string;
  width: string;
  alignRight?: boolean;
}) {
  return (
    <Text
      style={[
        styles.tableCell,
        { width, textAlign: alignRight ? "right" : "left" },
      ]}
    >
      {children}
    </Text>
  );
}

export default function AccountExportPdf({ data }: AccountExportPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Nextill Account Export Report</Text>
          <Text style={styles.subtitle}>
            Summary of account, settings, menu, stock, and activity
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Exported on: {data.exportedAt}</Text>
            <Text style={styles.metaText}>Readable summary export</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Account overview</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard label="Email" value={data.user.email} />
            <SummaryCard label="Username" value={data.user.username} />
            <SummaryCard label="Account created" value={data.user.createdAt} />
            <SummaryCard
              label="Email confirmed"
              value={boolText(data.user.emailConfirmed)}
            />
            <SummaryCard
              label="Day status"
              value={data.settings.dayActive ? "Active" : "Inactive"}
            />
            <SummaryCard label="Current day" value={data.settings.dayDate} />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Quick totals</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard label="Menu items" value={String(data.menu.totalItems)} />
            <SummaryCard label="Stock items" value={String(data.stock.totalItems)} />
            <SummaryCard
              label="Daily summaries"
              value={String(data.dailySummaries.totalSummaries)}
            />
            <SummaryCard
              label="Archived menu items"
              value={String(data.menu.archivedItems)}
            />
            <SummaryCard
              label="Archived stock items"
              value={String(data.stock.archivedItems)}
            />
            <SummaryCard
              label="Stock activity entries"
              value={String(data.stockActivity.totalEntries)}
            />
          </View>
        </View>

        <Text style={styles.footer} fixed>
          For a complete data backup and future restore, use the JSON export.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Account details</Text>
          <Text style={styles.subtitle}>
            Current account, day cycle, and app configuration
          </Text>
        </View>

        <View style={styles.section}>
          <SectionTitle>Account details</SectionTitle>
          <View>
            <FieldRow label="Email" value={data.user.email} />
            <FieldRow label="Username" value={data.user.username} />
            <FieldRow label="Account created" value={data.user.createdAt} />
            <FieldRow
              label="Email confirmed"
              value={boolText(data.user.emailConfirmed)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Day cycle</SectionTitle>
          <View>
            <FieldRow
              label="Day status"
              value={data.settings.dayActive ? "Active" : "Inactive"}
            />
            <FieldRow label="Day date" value={data.settings.dayDate} />
            <FieldRow label="Day key" value={data.settings.dayCycle.dayKey} />
            <FieldRow label="Started at" value={data.settings.dayCycle.startedAt} />
            <FieldRow label="Ended at" value={data.settings.dayCycle.endedAt} />
            <FieldRow
              label="Opening balance"
              value={data.settings.dayCycle.openingBalance}
            />
            <FieldRow
              label="Closing balance"
              value={data.settings.dayCycle.closingBalance}
            />
            <FieldRow
              label="Next ticket number"
              value={data.settings.dayCycle.nextTicketNumber}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>App settings</SectionTitle>
          <View>
            <FieldRow label="Language" value={data.settings.language} />
            <FieldRow label="Currency" value={data.settings.currency} />
            <FieldRow label="Dark mode" value={boolText(data.settings.darkMode)} />
            <FieldRow
              label="Staff ticket printing"
              value={onOffText(data.settings.staffTicketPrinting)}
            />
            <FieldRow
              label="Customer receipt printing"
              value={onOffText(data.settings.receiptPrinting)}
            />
            <FieldRow
              label="Start/end balance"
              value={onOffText(data.settings.balanceEnabled)}
            />
            <FieldRow
              label="Motion reduced"
              value={boolText(data.settings.motionReduced)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Statistics</SectionTitle>
          <View>
            <FieldRow
              label="Total earnings"
              value={data.settings.statistics.totalEarnings}
            />
            <FieldRow
              label="Total transactions"
              value={data.settings.statistics.totalTransactions}
            />
            <FieldRow
              label="Units sold"
              value={data.settings.statistics.unitsSoldTotal}
            />
            <FieldRow label="Last sale at" value={data.settings.statistics.lastSaleAt} />
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Menu summary</Text>
          <Text style={styles.subtitle}>Overview of menu items and categories</Text>
        </View>

        <View style={styles.section}>
          <SectionTitle>Menu overview</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard label="Total menu items" value={String(data.menu.totalItems)} />
            <SummaryCard label="Active menu items" value={String(data.menu.activeItems)} />
            <SummaryCard label="Archived menu items" value={String(data.menu.archivedItems)} />
            <SummaryCard label="Categories" value={String(data.menu.categories.length)} />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Category breakdown</SectionTitle>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <TableCell width="40%">Category</TableCell>
              <TableCell width="20%" alignRight>
                Total
              </TableCell>
              <TableCell width="20%" alignRight>
                Active
              </TableCell>
              <TableCell width="20%" alignRight>
                Archived
              </TableCell>
            </View>
            {data.menu.categories.map((category) => (
              <View key={category.name} style={styles.tableRow}>
                <TableCell width="40%">{category.name}</TableCell>
                <TableCell width="20%" alignRight>
                  {String(category.totalItems)}
                </TableCell>
                <TableCell width="20%" alignRight>
                  {String(category.activeItems)}
                </TableCell>
                <TableCell width="20%" alignRight>
                  {String(category.archivedItems)}
                </TableCell>
              </View>
            ))}
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Stock and activity summary</Text>
          <Text style={styles.subtitle}>
            Overview of stock data, recent activity, and daily summaries
          </Text>
        </View>

        <View style={styles.section}>
          <SectionTitle>Stock overview</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard label="Total stock items" value={String(data.stock.totalItems)} />
            <SummaryCard label="Active stock items" value={String(data.stock.activeItems)} />
            <SummaryCard label="Archived stock items" value={String(data.stock.archivedItems)} />
            <SummaryCard label="Low stock items" value={String(data.stock.lowStockItems)} />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Stock category breakdown</SectionTitle>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <TableCell width="34%">Category</TableCell>
              <TableCell width="16%" alignRight>
                Total
              </TableCell>
              <TableCell width="16%" alignRight>
                Active
              </TableCell>
              <TableCell width="16%" alignRight>
                Archived
              </TableCell>
              <TableCell width="18%" alignRight>
                Low stock
              </TableCell>
            </View>
            {data.stock.categories.map((category) => (
              <View key={category.name} style={styles.tableRow}>
                <TableCell width="34%">{category.name}</TableCell>
                <TableCell width="16%" alignRight>
                  {String(category.totalItems)}
                </TableCell>
                <TableCell width="16%" alignRight>
                  {String(category.activeItems)}
                </TableCell>
                <TableCell width="16%" alignRight>
                  {String(category.archivedItems)}
                </TableCell>
                <TableCell width="18%" alignRight>
                  {String(category.lowStockItems)}
                </TableCell>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Recent stock activity</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard
              label="Stock activity entries"
              value={String(data.stockActivity.totalEntries)}
            />
            <SummaryCard label="Last activity" value={data.stockActivity.lastActivity} />
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <TableCell width="26%">Date</TableCell>
              <TableCell width="18%">Action</TableCell>
              <TableCell width="26%">Item</TableCell>
              <TableCell width="15%" alignRight>
                Delta
              </TableCell>
              <TableCell width="15%" alignRight>
                After
              </TableCell>
            </View>
            {data.stockActivity.recentActivities.map((activity, i) => (
              <View
                 key={`${activity.createdAt}-${activity.itemName}-${activity.action}-${i}`}
                style={styles.tableRow}
              >
                <TableCell width="26%">{activity.createdAt}</TableCell>
                <TableCell width="18%">{activity.action}</TableCell>
                <TableCell width="26%">{activity.itemName}</TableCell>
                <TableCell width="15%" alignRight>
                  {activity.quantityDelta}
                </TableCell>
                <TableCell width="15%" alignRight>
                  {activity.quantityAfter}
                </TableCell>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Daily summaries</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard
              label="Daily summaries"
              value={String(data.dailySummaries.totalSummaries)}
            />
            <SummaryCard label="Date range" value={data.dailySummaries.dateRange} />
            <SummaryCard label="Total earnings" value={data.dailySummaries.totalEarnings} />
            <SummaryCard
              label="Total transactions"
              value={data.dailySummaries.totalTransactions}
            />
            <SummaryCard
              label="Most recent summary"
              value={data.dailySummaries.mostRecentSummary}
            />
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <TableCell width="34%">Date</TableCell>
              <TableCell width="33%" alignRight>
                Earnings
              </TableCell>
              <TableCell width="33%" alignRight>
                Transactions
              </TableCell>
            </View>
            {data.dailySummaries.recentSummaries.map((summary) => (
              <View key={summary.date} style={styles.tableRow}>
                <TableCell width="34%">{summary.date}</TableCell>
                <TableCell width="33%" alignRight>
                  {summary.earnings}
                </TableCell>
                <TableCell width="33%" alignRight>
                  {summary.transactions}
                </TableCell>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer} fixed>
          For a complete data backup and future restore, use the JSON export.
        </Text>
      </Page>
    </Document>
  );
}


/*

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

export type AccountExportReport = {
  exportedAt: string;
  user: {
    email: string;
    username: string;
    emailConfirmed: boolean;
  };
  settings: {
    dayActive: boolean;
    language: string;
    currency: string;
    staffTicketPrinting: boolean;
    receiptPrinting: boolean;
    balanceEnabled: boolean;
    motionReduced: boolean;
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
  };
  reports: {
    totalReports: number;
    dateRange: string;
    mostRecentReport: string;
    totalSales?: number;
    totalOrders?: number;
    totalDiscounts?: number;
    totalTaxes?: number;
  };
};

type AccountExportPdfProps = {
  data: AccountExportReport;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 28,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 9,
    color: "#4B5563",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: "#111827",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  card: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 8,
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  cardValue: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  label: {
    color: "#4B5563",
    width: "55%",
  },
  value: {
    fontWeight: 700,
    color: "#111827",
    width: "45%",
    textAlign: "right",
  },
  table: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 700,
    color: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 9,
    color: "#111827",
  },
  footer: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 18,
    fontSize: 8,
    color: "#6B7280",
    textAlign: "center",
  },
});

function boolText(value: boolean) {
  return value ? "Yes" : "No";
}

function onOffText(value: boolean) {
  return value ? "On" : "Off";
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export default function AccountExportPdf({ data }: AccountExportPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Nextill Account Export Report</Text>
          <Text style={styles.subtitle}>
            Summary of account, settings, menu, stock, and reports
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Exported on: {data.exportedAt}</Text>
            <Text style={styles.metaText}>Readable summary export</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Account overview</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard label="Email" value={data.user.email} />
            <SummaryCard label="Username" value={data.user.username} />
            <SummaryCard
              label="Email confirmed"
              value={boolText(data.user.emailConfirmed)}
            />
            <SummaryCard
              label="Day status"
              value={data.settings.dayActive ? "Active" : "Inactive"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>System settings</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard label="Language" value={data.settings.language} />
            <SummaryCard label="Currency" value={data.settings.currency} />
            <SummaryCard
              label="Staff ticket printing"
              value={onOffText(data.settings.staffTicketPrinting)}
            />
            <SummaryCard
              label="Customer receipt printing"
              value={onOffText(data.settings.receiptPrinting)}
            />
            <SummaryCard
              label="Start/end balance"
              value={onOffText(data.settings.balanceEnabled)}
            />
            <SummaryCard
              label="Motion reduced"
              value={boolText(data.settings.motionReduced)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Quick totals</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard label="Menu items" value={String(data.menu.totalItems)} />
            <SummaryCard label="Stock items" value={String(data.stock.totalItems)} />
            <SummaryCard label="Reports" value={String(data.reports.totalReports)} />
            <SummaryCard
              label="Archived menu items"
              value={String(data.menu.archivedItems)}
            />
            <SummaryCard
              label="Archived stock items"
              value={String(data.stock.archivedItems)}
            />
          </View>
        </View>

        <Text style={styles.footer} fixed>
          For a complete data backup and future restore, use the JSON export.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Account details</Text>
          <Text style={styles.subtitle}>Current account and app configuration</Text>
        </View>

        <View style={styles.section}>
          <SectionTitle>Account details</SectionTitle>
          <View>
            <FieldRow label="Email" value={data.user.email} />
            <FieldRow label="Username" value={data.user.username} />
            <FieldRow
              label="Email confirmed"
              value={boolText(data.user.emailConfirmed)}
            />
            <FieldRow
              label="Day status"
              value={data.settings.dayActive ? "Active" : "Inactive"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Localization</SectionTitle>
          <View>
            <FieldRow label="Language" value={data.settings.language} />
            <FieldRow label="Currency" value={data.settings.currency} />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>App behavior</SectionTitle>
          <View>
            <FieldRow
              label="Staff ticket printing"
              value={onOffText(data.settings.staffTicketPrinting)}
            />
            <FieldRow
              label="Customer receipt printing"
              value={onOffText(data.settings.receiptPrinting)}
            />
            <FieldRow
              label="Start/end balance"
              value={onOffText(data.settings.balanceEnabled)}
            />
            <FieldRow
              label="Motion reduced"
              value={boolText(data.settings.motionReduced)}
            />
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Menu summary</Text>
          <Text style={styles.subtitle}>Overview of menu items and categories</Text>
        </View>

        <View style={styles.section}>
          <SectionTitle>Menu overview</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard label="Total menu items" value={String(data.menu.totalItems)} />
            <SummaryCard label="Active menu items" value={String(data.menu.totalItems - data.menu.archivedItems)} />
            <SummaryCard label="Archived menu items" value={String(data.menu.archivedItems)} />
            <SummaryCard label="Categories" value={String(data.menu.categories.length)} />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Category breakdown</SectionTitle>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: "40%" }]}>Category</Text>
              <Text style={[styles.tableHeaderCell, { width: "20%", textAlign: "right" }]}>Total items</Text>
              <Text style={[styles.tableHeaderCell, { width: "20%", textAlign: "right" }]}>Active</Text>
              <Text style={[styles.tableHeaderCell, { width: "20%", textAlign: "right" }]}>Archived</Text>
            </View>
            {data.menu.categories.map((category) => (
              <View key={category.name} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "40%" }]}>{category.name}</Text>
                <Text style={[styles.tableCell, { width: "20%", textAlign: "right" }]}>
                  {category.totalItems}
                </Text>
                <Text style={[styles.tableCell, { width: "20%", textAlign: "right" }]}>
                  {category.activeItems}
                </Text>
                <Text style={[styles.tableCell, { width: "20%", textAlign: "right" }]}>
                  {category.archivedItems}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Stock and reports summary</Text>
          <Text style={styles.subtitle}>Overview of stock data and recorded reports</Text>
        </View>

        <View style={styles.section}>
          <SectionTitle>Stock summary</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard label="Total stock items" value={String(data.stock.totalItems)} />
            <SummaryCard label="Active stock items" value={String(data.stock.activeItems)} />
            <SummaryCard label="Archived stock items" value={String(data.stock.archivedItems)} />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>Reports summary</SectionTitle>
          <View style={styles.cardGrid}>
            <SummaryCard label="Total reports" value={String(data.reports.totalReports)} />
            <SummaryCard label="Date range" value={data.reports.dateRange} />
            <SummaryCard label="Most recent report" value={data.reports.mostRecentReport} />
            <SummaryCard
              label="Total sales"
              value={data.reports.totalSales !== undefined ? String(data.reports.totalSales) : "—"}
            />
            <SummaryCard
              label="Total orders"
              value={data.reports.totalOrders !== undefined ? String(data.reports.totalOrders) : "—"}
            />
            <SummaryCard
              label="Total discounts"
              value={data.reports.totalDiscounts !== undefined ? String(data.reports.totalDiscounts) : "—"}
            />
            <SummaryCard
              label="Total taxes"
              value={data.reports.totalTaxes !== undefined ? String(data.reports.totalTaxes) : "—"}
            />
          </View>
        </View>

        <Text style={styles.footer} fixed>
          For a complete data backup and future restore, use the JSON export.
        </Text>
      </Page>
    </Document>
  );
}


*/
