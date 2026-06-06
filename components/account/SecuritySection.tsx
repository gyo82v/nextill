"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import AccountSectionCard from "./AccountSectionCard";

type SecuritySectionProps = {
  onResetPassword: () => Promise<void>;
  onDeleteAccount: (password: string) => Promise<void>;
  dayActive: boolean;
};

type FeedbackState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export default function SecuritySection({
  onResetPassword,
  onDeleteAccount,
  dayActive,
}: SecuritySectionProps) {
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    "resetPassword" | "deleteAccount" | null
  >(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  async function handleResetPassword() {
    setFeedback(null);
    setLoadingAction("resetPassword");

    try {
      await onResetPassword();
      setFeedback({
        type: "success",
        message: "Password reset email sent.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to reset password.",
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
        message: "End the day before deleting the account.",
      });
      return;
    }

    if (!deletePassword.trim()) {
      setFeedback({
        type: "error",
        message: "Enter your password.",
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
        message: "Account deleted.",
      });
      setDeletePassword("");
      setConfirmDeleteOpen(false);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete account.",
      });
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <AccountSectionCard
      title="Security"
      description="Manage your password and account deletion."
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

        <div className="flex flex-col gap-2 rounded-xl border border-default bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">Reset password</h3>
            <p className="text-sm text-muted-foreground">
              Send a password reset email to your account address.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleResetPassword}
            disabled={loadingAction !== null}
            loading={loadingAction === "resetPassword"}
            loadingText="Sending"
          >
            Reset password
          </Button>
        </div>

        <div className="space-y-3 rounded-xl border border-default bg-surface-2 px-4 py-3">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">Delete account</h3>
            <p className="text-sm text-muted-foreground">
              Enter your password to permanently delete your account.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="deletePassword"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>

            <input
              id="deletePassword"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-default bg-surface-1 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="button"
            variant="danger"
            onClick={handleOpenDeleteConfirm}
            disabled={loadingAction !== null || dayActive}
          >
            Delete account
          </Button>

          {dayActive ? (
            <p className="text-xs text-orange-600">
              End the day before deleting the account.
            </p>
          ) : null}
        </div>

        <ConfirmModal
          open={confirmDeleteOpen}
          onClose={() => {
            if (loadingAction !== "deleteAccount") setConfirmDeleteOpen(false);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete account"
          description="This will permanently delete your account and all your data."
          confirmLabel="Delete account"
          cancelLabel="Cancel"
          loading={loadingAction === "deleteAccount"}
          danger
        />
      </div>
    </AccountSectionCard>
  );
}


/*


"use client";

import Button from "@/components/ui/Button";
import AccountSectionCard from "./AccountSectionCard";

type SecuritySectionProps = {
  onResetPassword: () => void;
  onDeleteAccount: () => void;
  securityLoading?: boolean;
  dayActive: boolean;
  deletePassword: string;
  setDeletePassword: (value: string) => void;
};

export default function SecuritySection({
  onResetPassword,
  onDeleteAccount,
  securityLoading = false,
  dayActive,
  deletePassword,
  setDeletePassword,
}: SecuritySectionProps) {
  return (
    <AccountSectionCard
      title="Security"
      description="Manage your password and account deletion."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-2 rounded-xl border border-default bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">Reset password</h3>
            <p className="text-sm text-muted-foreground">
              Send a password reset email to your account address.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={onResetPassword}
            disabled={securityLoading}
          >
            Reset password
          </Button>
        </div>

        <div className="space-y-3 rounded-xl border border-default bg-surface-2 px-4 py-3">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">Delete account</h3>
            <p className="text-sm text-muted-foreground">
              Enter your password to permanently delete your account.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="deletePassword"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>

            <input
              id="deletePassword"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-default bg-surface-1 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="button"
            onClick={onDeleteAccount}
            disabled={securityLoading || dayActive}
            variant="danger"
          >
            Delete account
          </Button>

          {dayActive ? (
            <p className="text-xs text-orange-600">
              End the day before deleting the account.
            </p>
          ) : null}
        </div>
      </div>
    </AccountSectionCard>
  );
}



*/