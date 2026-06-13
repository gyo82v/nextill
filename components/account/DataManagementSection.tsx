"use client";

import { useState } from "react";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import AccountSectionCard from "./AccountSectionCard";
import type { DataManagementAction, DataManagementSectionProps, FeedbackState, ActionConfig} from "@/types";
import DangerActionRow from "./DangerActionRow";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation("account")

  const actionConfig: Record<DataManagementAction, ActionConfig> = {
    clearReports: {
      title: t("management.clearReports.title"),
      description: t("management.clearReports.description"),
      buttonLabel:  t("management.clearReports.buttonLabel"),
      confirmLabel: t("management.clearReports.confirmLabel"),
      successMessage: t("management.clearReports.successMessage"),
      handler: onClearReports,
    },
    deleteArchivedItems: {
      title: t("management.deleteArchivedItems.title"),
      description: t("management.deleteArchivedItems.description"),
      buttonLabel: t("management.deleteArchivedItems.buttonLabel"),
      confirmLabel: t("management.deleteArchivedItems.confirmLabel"),
      successMessage: t("management.deleteArchivedItems.successMessage"),
      handler: onDeleteArchivedItems,
    },
    deleteArchivedMenuItems: {
      title: t("management.deleteArchivedMenuItems.title"),
      description: t("management.deleteArchivedMenuItems.description"),
      buttonLabel: t("management.deleteArchivedMenuItems.buttonLabel"),
      confirmLabel: t("management.deleteArchivedMenuItems.confirmLabel"),
      successMessage: t("management.deleteArchivedMenuItems.successMessage"),
      handler: onDeleteArchivedMenuItems,
    },
    deleteArchivedStockItems: {
      title: t("management.deleteArchivedStockItems.title"),
      description: t("management.deleteArchivedStockItems.description"),
      buttonLabel: t("management.deleteArchivedStockItems.buttonLabel"),
      confirmLabel: t("management.deleteArchivedStockItems.confirmLabel"),
      successMessage: t("management.deleteArchivedStockItems.successMessage"),
      handler: onDeleteArchivedStockItems,
    },
    resetAllData: {
      title: t("management.resetAllData.title"),
      description: t("management.resetAllData.description"),
      buttonLabel: t("management.resetAllData.buttonLabel"),
      confirmLabel: t("management.resetAllData.confirmLabel"),
      successMessage: t("management.resetAllData.successMessage"),
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
      title={t("management.title")}
      description={t("management.description")}
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
            {t("management.dayActiveMsg")}
          </p>
        ) : null}

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("management.sections.reports.title")}
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
            {t("management.sections.archived.title")}
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
            {t("management.sections.fullReset.title")}
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
        cancelLabel={t("management.cancelButtonLabel")}
        loading={loadingAction !== null}
        danger
      />
    </AccountSectionCard>
  );
}
