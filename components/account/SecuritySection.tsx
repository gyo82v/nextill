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