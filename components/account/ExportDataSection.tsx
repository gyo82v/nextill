"use client";

import Button from "@/components/ui/Button";
import AccountSectionCard from "./AccountSectionCard";

type ExportDataSectionProps = {
  onExportData: () => void;
  exportLoading?: boolean;
};

export default function ExportDataSection({
  onExportData,
  exportLoading = false,
}: ExportDataSectionProps) {
  return (
    <AccountSectionCard
      title="Export data"
      description="Download a copy of your account and app data."
    >
      <div className="flex flex-col gap-4 rounded-xl border border-default bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-foreground">Backup download</h3>
          <p className="text-sm text-muted-foreground">
            Export your data as a file you can keep for backup or transfer.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={onExportData}
          disabled={exportLoading}
          loading={exportLoading}
          loadingText="Exporting"
        >
          Download backup
        </Button>
      </div>
    </AccountSectionCard>
  );
}