"use client";

import Button from "@/components/ui/Button";
import AccountSectionCard from "./AccountSectionCard";

type ExportDataSectionProps = {
  onExportPdf: () => Promise<void>;
  onExportBackup: () => Promise<void>;
  loadingAction?: "pdf" | "backup" | null;
};

function ExportRow({
  title,
  description,
  buttonLabel,
  onClick,
  loading,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button
        type="button"
        variant="primary"
        onClick={onClick}
        loading={loading}
        loadingText="Downloading"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

export default function ExportDataSection({
  onExportPdf,
  onExportBackup,
  loadingAction = null,
}: ExportDataSectionProps) {
  return (
    <AccountSectionCard
      title="Export data"
      description="Download a copy of your account data for backup, records, or transfer."
    >
      <div className="space-y-4">
        <ExportRow
          title="PDF summary"
          description="Download a readable summary of your account, settings, and activity. Suitable for printing or sharing."
          buttonLabel="Download PDF"
          onClick={onExportPdf}
          loading={loadingAction === "pdf"}
        />

        <ExportRow
          title="Full backup (JSON)"
          description="Download a complete backup of your data in JSON format. Intended for backup or future restore."
          buttonLabel="Download backup"
          onClick={onExportBackup}
          loading={loadingAction === "backup"}
        />
      </div>
    </AccountSectionCard>
  );
}


/*

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



*/