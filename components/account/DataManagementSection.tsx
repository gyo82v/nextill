"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import AccountSectionCard from "./AccountSectionCard";

type DataManagementAction =
  | "clearReports"
  | "deleteArchivedItems"
  | "deleteArchivedMenuItems"
  | "deleteArchivedStockItems"
  | "resetAllData";

type DataManagementSectionProps = {
  dayActive: boolean;
  onClearReports?: () => Promise<void>;
  onDeleteArchivedItems?: () => Promise<void>;
  onDeleteArchivedMenuItems?: () => Promise<void>;
  onDeleteArchivedStockItems?: () => Promise<void>;
  onResetAllData?: () => Promise<void>;
};

type FeedbackState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

type ActionConfig = {
  title: string;
  description: string;
  buttonLabel: string;
  confirmLabel: string;
  successMessage: string;
  handler?: () => Promise<void>;
};

function DangerActionRow({
  title,
  description,
  buttonLabel,
  onClick,
  disabled,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick?: () => void;
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
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

export default function DataManagementSection({
  dayActive,
  onClearReports,
  onDeleteArchivedItems,
  onDeleteArchivedMenuItems,
  onDeleteArchivedStockItems,
  onResetAllData,
}: DataManagementSectionProps) {
  const [confirmAction, setConfirmAction] = useState<DataManagementAction | null>(
    null
  );
  const [loadingAction, setLoadingAction] = useState<DataManagementAction | null>(
    null
  );
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const actionConfig: Record<DataManagementAction, ActionConfig> = {
    clearReports: {
      title: "Clear reports / statistics",
      description: "Delete the reports and statistics data only.",
      buttonLabel: onClearReports ? "Clear reports" : "Coming soon",
      confirmLabel: "Clear reports",
      successMessage: "Reports cleared.",
      handler: onClearReports,
    },
    deleteArchivedItems: {
      title: "Delete all archived items",
      description: "Remove all archived menu and stock items permanently.",
      buttonLabel: onDeleteArchivedItems ? "Delete archived items" : "Coming soon",
      confirmLabel: "Delete archived items",
      successMessage: "Archived items deleted.",
      handler: onDeleteArchivedItems,
    },
    deleteArchivedMenuItems: {
      title: "Delete archived menu items",
      description: "Remove only archived items from the menu list.",
      buttonLabel: onDeleteArchivedMenuItems ? "Delete menu archive" : "Coming soon",
      confirmLabel: "Delete menu archive",
      successMessage: "Archived menu items deleted.",
      handler: onDeleteArchivedMenuItems,
    },
    deleteArchivedStockItems: {
      title: "Delete archived stock items",
      description: "Remove only archived items from the stock list.",
      buttonLabel: onDeleteArchivedStockItems ? "Delete stock archive" : "Coming soon",
      confirmLabel: "Delete stock archive",
      successMessage: "Archived stock items deleted.",
      handler: onDeleteArchivedStockItems,
    },
    resetAllData: {
      title: "Delete all database data",
      description: "Permanently remove all data, including archived items.",
      buttonLabel: onResetAllData ? "Delete all data" : "Coming soon",
      confirmLabel: "Delete all data",
      successMessage: "All data deleted.",
      handler: onResetAllData,
    },
  };

  const activeConfig = confirmAction ? actionConfig[confirmAction] : null;
  const isBusy = loadingAction !== null || confirmAction !== null;

  async function handleConfirm() {
    if (!confirmAction || !activeConfig?.handler) return;

    setFeedback(null);
    setLoadingAction(confirmAction);

    try {
      await activeConfig.handler();
      setFeedback({ type: "success", message: activeConfig.successMessage });
      setConfirmAction(null);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Action failed.",
      });
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <AccountSectionCard
      title="Data management"
      description="Permanently remove reports or archived data from the database."
    >
      <div className="space-y-8">
        {feedback ? (
          <div
            className={[
              "rounded-xl border px-4 py-3 text-sm",
              feedback.type === "success"
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-red-300 bg-red-50 text-red-700",
            ].join(" ")}
          >
            {feedback.message}
          </div>
        ) : null}

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
            title={actionConfig.clearReports.title}
            description={actionConfig.clearReports.description}
            buttonLabel={actionConfig.clearReports.buttonLabel}
            onClick={
              actionConfig.clearReports.handler
                ? () => setConfirmAction("clearReports")
                : undefined
            }
            disabled={dayActive || isBusy || !actionConfig.clearReports.handler}
          />
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Archived cleanup
          </h3>

          <div className="space-y-3">
            <DangerActionRow
              title={actionConfig.deleteArchivedItems.title}
              description={actionConfig.deleteArchivedItems.description}
              buttonLabel={actionConfig.deleteArchivedItems.buttonLabel}
              onClick={
                actionConfig.deleteArchivedItems.handler
                  ? () => setConfirmAction("deleteArchivedItems")
                  : undefined
              }
              disabled={
                dayActive || isBusy || !actionConfig.deleteArchivedItems.handler
              }
            />

            <DangerActionRow
              title={actionConfig.deleteArchivedMenuItems.title}
              description={actionConfig.deleteArchivedMenuItems.description}
              buttonLabel={actionConfig.deleteArchivedMenuItems.buttonLabel}
              onClick={
                actionConfig.deleteArchivedMenuItems.handler
                  ? () => setConfirmAction("deleteArchivedMenuItems")
                  : undefined
              }
              disabled={
                dayActive ||
                isBusy ||
                !actionConfig.deleteArchivedMenuItems.handler
              }
            />

            <DangerActionRow
              title={actionConfig.deleteArchivedStockItems.title}
              description={actionConfig.deleteArchivedStockItems.description}
              buttonLabel={actionConfig.deleteArchivedStockItems.buttonLabel}
              onClick={
                actionConfig.deleteArchivedStockItems.handler
                  ? () => setConfirmAction("deleteArchivedStockItems")
                  : undefined
              }
              disabled={
                dayActive ||
                isBusy ||
                !actionConfig.deleteArchivedStockItems.handler
              }
            />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Full reset
          </h3>

          <DangerActionRow
            title={actionConfig.resetAllData.title}
            description={actionConfig.resetAllData.description}
            buttonLabel={actionConfig.resetAllData.buttonLabel}
            onClick={
              actionConfig.resetAllData.handler
                ? () => setConfirmAction("resetAllData")
                : undefined
            }
            disabled={dayActive || isBusy || !actionConfig.resetAllData.handler}
          />
        </section>
      </div>

      <ConfirmModal
        open={confirmAction !== null}
        onClose={() => {
          if (!loadingAction) setConfirmAction(null);
        }}
        onConfirm={handleConfirm}
        title={activeConfig?.title ?? "Confirm action"}
        description={activeConfig?.description ?? ""}
        confirmLabel={activeConfig?.confirmLabel ?? "Confirm"}
        cancelLabel="Cancel"
        loading={loadingAction !== null}
        danger
      />
    </AccountSectionCard>
  );
}

/*

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




*/