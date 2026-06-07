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
