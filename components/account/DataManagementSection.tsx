"use client";

import Button from "@/components/ui/Button";
import AccountSectionCard from "./AccountSectionCard";

type DataManagementAction =
  | "clearReports"
  | "deleteArchivedItems"
  | "deleteArchivedMenuItems"
  | "deleteArchivedStockItems"
  | "resetAllData"
  | null;

type DataManagementSectionProps = {
  dayActive: boolean;
  loadingAction?: DataManagementAction;

  onClearReports?: () => void;
  onDeleteArchivedItems?: () => void;
  onDeleteArchivedMenuItems?: () => void;
  onDeleteArchivedStockItems?: () => void;
  onResetAllData?: () => void;
};

function DangerActionRow({
  title,
  description,
  buttonLabel,
  onClick,
  loading,
  disabled,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button
        type="button"
        variant="danger"
        onClick={onClick}
        disabled={disabled || !onClick}
        loading={loading}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

export default function DataManagementSection({
  dayActive,
  loadingAction = null,
  onClearReports,
  onDeleteArchivedItems,
  onDeleteArchivedMenuItems,
  onDeleteArchivedStockItems,
  onResetAllData,
}: DataManagementSectionProps) {
  const isBusy = loadingAction !== null;

  return (
    <AccountSectionCard
      title="Data management"
      description="Permanently remove reports or archived data from the database."
    >
      <div className="space-y-8">
        {dayActive ? (
          <p className="rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 text-sm text-orange-700">
            Destructive actions are disabled while a day is active.
          </p>
        ) : null}

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Reports
          </h3>

          <DangerActionRow
            title="Clear reports / statistics"
            description="Delete the reports and statistics data only."
            buttonLabel="Clear reports"
            onClick={onClearReports}
            loading={loadingAction === "clearReports"}
            disabled={dayActive || isBusy}
          />
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Archived cleanup
          </h3>

          <div className="space-y-3">
            <DangerActionRow
              title="Delete all archived items"
              description="Remove all archived menu and stock items permanently."
              buttonLabel="Delete archived items"
              onClick={onDeleteArchivedItems}
              loading={loadingAction === "deleteArchivedItems"}
              disabled={dayActive || isBusy}
            />

            <DangerActionRow
              title="Delete archived menu items"
              description="Remove only archived items from the menu list."
              buttonLabel="Delete menu archive"
              onClick={onDeleteArchivedMenuItems}
              loading={loadingAction === "deleteArchivedMenuItems"}
              disabled={dayActive || isBusy}
            />

            <DangerActionRow
              title="Delete archived stock items"
              description="Remove only archived items from the stock list."
              buttonLabel="Delete stock archive"
              onClick={onDeleteArchivedStockItems}
              loading={loadingAction === "deleteArchivedStockItems"}
              disabled={dayActive || isBusy}
            />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Full reset
          </h3>

          <DangerActionRow
            title="Delete all database data"
            description="Permanently remove all data, including archived items."
            buttonLabel="Delete all data"
            onClick={onResetAllData}
            loading={loadingAction === "resetAllData"}
            disabled={dayActive || isBusy}
          />
        </section>
      </div>
    </AccountSectionCard>
  );
}

/*

import Button from "../ui/Button"

export default function DataManagementSection({dayActive, actionLoading, resetData}){
    return(
        <section>
            <h2 className="text-lg font-medium">Data management</h2>
            {dayActive ? (
          <p className="text-sm text-orange-600">
            Destructive actions are disabled while a day is active.
          </p>
        ) : null}
        <div>
            <Button
              type="button"
              variant="danger"
              disabled={actionLoading || dayActive}
              loading={actionLoading}
              onClick={resetData}
            >
                Reset all data
            </Button>



        </div>
        </section>
    )
}




*/