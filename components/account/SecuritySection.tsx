"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import AccountSectionCard from "./AccountSectionCard";
import type { SecuritySectionProps, FeedbackState } from "@/types";
import { inputBaseStyle } from "@/styles";
import { useTranslation } from "react-i18next";

export default function SecuritySection({
  onResetPassword,
  onDeleteAccount,
  dayActive,
}: SecuritySectionProps) {
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<"resetPassword" | "deleteAccount" | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const {t} = useTranslation("account")

  async function handleResetPassword() {
    setFeedback(null);
    setLoadingAction("resetPassword");

    try {
      await onResetPassword();
      setFeedback({
        type: "success",
        message: t("security.messages.resetPasswordSuccess"),
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : t("security.messages.resetPasswordError"),
      });
    } finally {
      setLoadingAction(null);
    }
  }

  function handleOpenDeleteConfirm() {
    setFeedback(null);

    if (dayActive) {
      setFeedback({
        type: "error",
        message: t("security.messages.deleteAccountDayActiveError"),
      });
      return;
    }

    if (!deletePassword.trim()) {
      setFeedback({
        type: "error",
        message: t("security.messages.deleteAccountPasswordMissingError"),
      });
      return;
    }

    setConfirmDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    setFeedback(null);
    setLoadingAction("deleteAccount");

    try {
      await onDeleteAccount(deletePassword);
      setFeedback({
        type: "success",
        message: t("security.messages.deleteAccountSuccess"),
      });
      setDeletePassword("");
      setConfirmDeleteOpen(false);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : t("security.messages.deleteAccountError"),
      });
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <AccountSectionCard
      title={t("security.title")}
      description={t("security.description")}
    >
      <div className="space-y-6">
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

        <div className={`flex flex-col gap-2 rounded-xl border border-default bg-surface-2
                         px-4 py-3 sm:flex-row sm:items-center sm:justify-between`}>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">
              {t("security.resetPassword.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("security.resetPassword.description")}
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleResetPassword}
            disabled={loadingAction !== null}
            loading={loadingAction === "resetPassword"}
            loadingText={t("security.resetPassword.loadingText")}
          >
            {t("security.resetPassword.buttonLabel")}
          </Button>
        </div>

        <div className="space-y-3 rounded-xl border border-default bg-surface-2 px-4 py-3">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">
              {t("security.deleteAccount.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("security.deleteAccount.description")}
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="deletePassword"
              className="block text-sm font-medium text-foreground"
            >
              {t("security.deleteAccount.passwordLabel")}
            </label>

            <input
              id="deletePassword"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder={t("security.deleteAccount.passwordPlaceholder")}
              className={`w-full ${inputBaseStyle}`}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="button"
            variant="primaryDanger"
            onClick={handleOpenDeleteConfirm}
            disabled={loadingAction !== null || dayActive}
          >
            {t("security.deleteAccount.buttonLabel")}
          </Button>

          {dayActive ? (
            <p className="text-xs text-orange-600">
              {t("security.deleteAccount.dayActiveMessage")}
            </p>
          ) : null}
        </div>

        <ConfirmModal
          open={confirmDeleteOpen}
          onClose={() => {
            if (loadingAction !== "deleteAccount") setConfirmDeleteOpen(false);
          }}
          onConfirm={handleConfirmDelete}
          title={t("security.deleteAccount.modal.title")}
          description={t("security.deleteAccount.modal.description")}
          confirmLabel={t("security.deleteAccount.modal.confirmButtonLabel")}
          cancelLabel={t("security.deleteAccount.modal.cancelButtonLabel")}
          loading={loadingAction === "deleteAccount"}
          danger
        />
      </div>
    </AccountSectionCard>
  );
}