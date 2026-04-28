"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import LanguageToggle from "@/components/language-toggle";
import { db } from "@/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { exportUserData } from "@/firebase/exportData";
import { resetAllData } from "@/firebase/accountData";
import {
  deleteAccountWithPassword,
  resetPassword,
} from "@/firebase/accountAuth";
import { updateCurrency } from "@/firebase/userSettings";

type AccountSummary = {
  menuItems: number;
  stockItems: number;
  stockActivity: number;
  dailySummaries: number;
  totalEarnings: number;
  totalTransactions: number;
  unitsSoldTotal: number;
};

export default function AccountPage() {
  const { user, profile } = useAuth();

  const [summary, setSummary] = useState<AccountSummary>({
    menuItems: 0,
    stockItems: 0,
    stockActivity: 0,
    dailySummaries: 0,
    totalEarnings: 0,
    totalTransactions: 0,
    unitsSoldTotal: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [deletePassword, setDeletePassword] = useState("");
  const [resetAllConfirm, setResetAllConfirm] = useState("");
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);

  const dayActive = Boolean(profile?.nextillApp?.dayCycle?.active);
  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";
  const displayName =
    profile?.displayName ?? "—";

  const currencyOptions = useMemo(
    () => [
      { value: "EUR", label: "EUR (€)" },
      { value: "USD", label: "USD ($)" },
      { value: "GBP", label: "GBP (£)" },
      { value: "AUD", label: "AUD ($)" },
      { value: "CAD", label: "CAD ($)" },
    ],
    []
  );

  useEffect(() => {
    async function loadSummary() {
      if (!user) return;

      setLoadingSummary(true);
      setError(null);

      try {
        const userRef = doc(db, "users", user.uid);

        const stockRef = collection(db, "users", user.uid, "stock");
        const stockActivityRef = collection(
          db,
          "users",
          user.uid,
          "stockActivity"
        );
        const menuRef = collection(db, "users", user.uid, "menuItems");
        const dailySummariesRef = collection(
          db,
          "users",
          user.uid,
          "dailySummaries"
        );

        const [userSnap, stockSnap, stockActivitySnap, menuSnap, dailySnap] =
          await Promise.all([
            getDoc(userRef),
            getDocs(stockRef),
            getDocs(stockActivityRef),
            getDocs(menuRef),
            getDocs(dailySummariesRef),
          ]);

        const stats = userSnap.exists()
          ? userSnap.data()?.nextillApp?.statistics ?? {}
          : {};

        setSummary({
          menuItems: menuSnap.size,
          stockItems: stockSnap.size,
          stockActivity: stockActivitySnap.size,
          dailySummaries: dailySnap.size,
          totalEarnings: Number(stats.totalEarnings ?? 0),
          totalTransactions: Number(stats.totalTransactions ?? 0),
          unitsSoldTotal: Number(stats.unitsSoldTotal ?? 0),
        });
      } catch {
        setError("Failed to load account summary.");
      } finally {
        setLoadingSummary(false);
      }
    }

    if (showResetAllConfirm) {
      loadSummary();
    }
  }, [user, showResetAllConfirm]);

  if (!user || !profile) return null;

  async function handleResetPassword() {
    setError(null);
    setSuccess(null);

    try {
      if(!user) return
      if (!user.email) throw new Error("Missing email.");
      await resetPassword(user.email);
      setSuccess("Password reset email sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    }
  }

  async function handleCurrencyChange(value: string) {
    setError(null);
    setSuccess(null);

    try {
      if(!user) return
      await updateCurrency({ uid: user.uid, currency:value });
      setSuccess("Currency updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update currency.");
    }
  }

  async function handleExportData() {
    setError(null);
    setSuccess(null);
    setExportLoading(true);

    try {
      if (!user) return;
      const data = await exportUserData(user.uid);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nextill-backup-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setSuccess("Backup downloaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export data.");
    } finally {
      setExportLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setError(null);
    setSuccess(null);

    if (dayActive) {
      setError("End the day before deleting the account.");
      return;
    }

    if (!deletePassword.trim()) {
      setError("Enter your password.");
      return;
    }

    const confirmed = confirm(
      "This will permanently delete your account and all your data. Continue?"
    );

    if (!confirmed) return;

    setActionLoading(true);
    try {
      if(!user) return
      await resetAllData(user.uid);
      if (!user.email) throw new Error("Missing email.");
      await deleteAccountWithPassword(user.email, deletePassword);
      setSuccess("Account deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResetAllData() {
    setError(null);
    setSuccess(null);

    if (dayActive) {
      setError("End the day before resetting all data.");
      return;
    }

    if (resetAllConfirm !== "RESET ALL DATA") {
      setError('Type "RESET ALL DATA" to confirm.');
      return;
    }

    setActionLoading(true);
    try {
      if(!user) return
      await resetAllData(user.uid);
      setSuccess("All data reset.");
      setShowResetAllConfirm(false);
      setResetAllConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset data.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-10 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-sm opacity-70">
          Manage your profile, preferences, and system settings.
        </p>
      </div>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      {/* Profile */}
      <section className="space-y-3 rounded border p-4">
        <h2 className="text-lg font-medium">Profile</h2>

        <div className="grid gap-2 text-sm">
          <p>
            <span className="font-medium">Email:</span> {user.email ?? "—"}
          </p>
          <p>
            <span className="font-medium">Display name:</span> {displayName}
          </p>
          <p>
            <span className="font-medium">Day status:</span>{" "}
            {dayActive ? "Active" : "Inactive"}
          </p>
        </div>
      </section>

      {/* Security */}
      <section className="space-y-4 rounded border p-4">
        <h2 className="text-lg font-medium">Security</h2>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleResetPassword}
            className="rounded border px-4 py-2 text-sm"
          >
            Reset password
          </button>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Delete account</label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded border px-3 py-2 text-sm"
            />

            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={actionLoading || dayActive}
              className="rounded border px-4 py-2 text-sm text-red-600 disabled:opacity-50"
            >
              Delete account
            </button>

            {dayActive ? (
              <p className="text-xs text-orange-600">
                End the day before deleting the account.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-4 rounded border p-4">
        <h2 className="text-lg font-medium">Preferences</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Currency</label>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              {currencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Language</label>
            <LanguageToggle />
          </div>
        </div>
      </section>

      {/* Export */}
      <section className="space-y-4 rounded border p-4">
        <h2 className="text-lg font-medium">Export data</h2>

        <button
          type="button"
          onClick={handleExportData}
          disabled={exportLoading}
          className="rounded border px-4 py-2 text-sm disabled:opacity-50"
        >
          {exportLoading ? "Exporting…" : "Download backup"}
        </button>
      </section>

      {/* Data maintenance */}
      <section className="space-y-4 rounded border border-red-200 p-4">
        <h2 className="text-lg font-medium">Data maintenance</h2>

        {dayActive ? (
          <p className="text-sm text-orange-600">
            Destructive actions are disabled while a day is active.
          </p>
        ) : null}

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowResetAllConfirm((prev) => !prev)}
            disabled={actionLoading || dayActive}
            className="rounded border px-4 py-2 text-sm text-red-600 disabled:opacity-50"
          >
            Reset all data
          </button>

          {showResetAllConfirm ? (
            <div className="space-y-4 rounded border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                This will delete menu, stock, statistics, and daily summaries.
              </p>

              <div className="rounded border bg-white p-4">
                <h3 className="text-sm font-medium mb-3">Data summary</h3>

                {loadingSummary ? (
                  <p className="text-sm opacity-70">Loading summary…</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-3 text-sm">
                    <div>
                      <span className="font-medium">Menu items:</span>{" "}
                      {summary.menuItems}
                    </div>
                    <div>
                      <span className="font-medium">Stock items:</span>{" "}
                      {summary.stockItems}
                    </div>
                    <div>
                      <span className="font-medium">Stock activity entries:</span>{" "}
                      {summary.stockActivity}
                    </div>
                    <div>
                      <span className="font-medium">Daily summaries:</span>{" "}
                      {summary.dailySummaries}
                    </div>
                    <div>
                      <span className="font-medium">Total transactions:</span>{" "}
                      {summary.totalTransactions}
                    </div>
                    <div>
                      <span className="font-medium">Total earnings:</span>{" "}
                      {summary.totalEarnings}
                    </div>
                    <div className="md:col-span-3">
                      <span className="font-medium">Units sold total:</span>{" "}
                      {summary.unitsSoldTotal}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs opacity-70">
                Type <span className="font-semibold">RESET ALL DATA</span> to
                confirm.
              </p>

              <input
                type="text"
                value={resetAllConfirm}
                onChange={(e) => setResetAllConfirm(e.target.value)}
                placeholder="RESET ALL DATA"
                className="w-full rounded border px-3 py-2 text-sm"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleResetAllData}
                  disabled={actionLoading || dayActive}
                  className="rounded bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  Confirm full reset
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowResetAllConfirm(false);
                    setResetAllConfirm("");
                  }}
                  className="rounded border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}