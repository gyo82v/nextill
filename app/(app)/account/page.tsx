"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { useAuth } from "@/firebase/authProvider";
import {
  resetAllData,
  resetReports,
  deleteArchivedMenuAndStockItems,
  deleteArchivedMenuItems,
  deleteArchivedStockItems,
} from "@/firebase/accountData";
import { deleteAccountWithPassword, resetPassword } from "@/firebase/accountAuth";
import {
  updateCurrency,
  updateBalanceOption,
  updateReceiptOption,
  updateTicketOption,
  updateDisableMotion,
} from "@/firebase/userSettings";
import { DotLineDivider, MenuSectionDivider } from "@/components/ui/dividers/Dividers";
import AccountOverviewSection from "@/components/account/AccountOverviewSection";
import PreferencesSection from "@/components/account/PreferencesSection";
import SecuritySection from "@/components/account/SecuritySection";
import ExportDataSection from "@/components/account/ExportDataSection";
import DataManagementSection from "@/components/account/DataManagementSection";
import PrivacyPolicySection from "@/components/account/PrivacyPolicySection";
import AccountExportPdf from "@/components/account/export/AccountExportPdf";
import { buildAccountExportReport } from "@/components/account/export/buildAccountExportReport";
import { exportUserData } from "@/components/account/export/exportUserData";

export default function AccountPage() {
  const { user, profile } = useAuth();
  const [exportLoading, setExportLoading] = useState<"pdf" | "backup" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!user || !profile) return null;

  const uid = user.uid;
  const email = user.email;
  const dayActive = Boolean(profile?.nextillApp?.dayCycle?.active);
  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";
  const settings = profile?.nextillApp?.settings;

  function clearFeedback() {
    setError(null);
    setSuccess(null);
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleUpdateBalance() {
    clearFeedback();

    try {
      await updateBalanceOption({ uid });
      setSuccess("Balance updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update balance.");
    }
  }

  async function handleUpdateTicket() {
    clearFeedback();

    try {
      await updateTicketOption({ uid });
      setSuccess("Ticket printing updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update ticket printing."
      );
    }
  }

  async function handleUpdateReceipt() {
    clearFeedback();

    try {
      await updateReceiptOption({ uid });
      setSuccess("Receipt printing updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update receipt printing."
      );
    }
  }

  async function handleDisableMotion() {
    clearFeedback();

    try {
      await updateDisableMotion({ uid });
      setSuccess("Motion preference updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update motion preference."
      );
    }
  }

  async function handleCurrencyChange(value: string) {
    clearFeedback();

    try {
      await updateCurrency({ uid, currency: value });
      setSuccess("Currency updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update currency.");
    }
  }

  async function handleResetPassword() {
    if (!email) throw new Error("Missing email.");
    await resetPassword(email);
  }

  async function handleDeleteAccount(password: string) {
    if (dayActive) throw new Error("End the day before deleting the account.");
    if (!email) throw new Error("Missing email.");
    if (!password.trim()) throw new Error("Enter your password.");

    await resetAllData(uid);
    await deleteAccountWithPassword(email, password);
  }

  async function handleResetReports() {
    if (dayActive) throw new Error("End the day before resetting the reports.");
    await resetReports(uid);
  }

  async function handleResetAllData() {
    if (dayActive) throw new Error("End the day before resetting all data.");
    await resetAllData(uid);
  }

  async function handleDeleteArchivedMenu() {
    if (dayActive) {
      throw new Error("End the day before deleting archived items in the menu.");
    }
    await deleteArchivedMenuItems(uid);
  }

  async function handleDeleteArchivedStock() {
    if (dayActive) {
      throw new Error("End the day before deleting archived items in the stock.");
    }
    await deleteArchivedStockItems(uid);
  }

  async function handleDeleteArchivedAll() {
    if (dayActive) {
      throw new Error("End the day before deleting all archived items.");
    }
    await deleteArchivedMenuAndStockItems(uid);
  }

  async function handleExportPdf() {
    clearFeedback();
    setExportLoading("pdf");

    try {
      const rawData = await exportUserData(uid);
      const reportData = buildAccountExportReport({
        ...rawData,
        exportedAt: new Date(),
      });

      const blob = await pdf(<AccountExportPdf data={reportData} />).toBlob();
      const safeDate = new Date().toISOString().replace(/[:.]/g, "-");

      downloadBlob(blob, `nextill-account-report-${safeDate}.pdf`);
      setSuccess("PDF report downloaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export PDF.");
    } finally {
      setExportLoading(null);
    }
  }

  async function handleExportBackup() {
    clearFeedback();
    setExportLoading("backup");

    try {
      const data = await exportUserData(uid);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const safeDate = new Date().toISOString().replace(/[:.]/g, "-");
      downloadBlob(blob, `nextill-backup-${safeDate}.json`);
      setSuccess("Backup downloaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export backup.");
    } finally {
      setExportLoading(null);
    }
  }

  return (
    <main className="w-full px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="relative grid w-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start">
        <section className="flex w-full justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-10 sm:mb-6 lg:mb-10">
              <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
              <p className="mt-1 text-sm text-muted">
                Manage your profile, preferences, and system settings.
              </p>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            ) : null}

            <div className="mt-8 space-y-8">
              <AccountOverviewSection user={user} profile={profile} />

              <PreferencesSection
                currency={currency}
                onCurrencyChange={handleCurrencyChange}
                onBalanceEnabledChange={handleUpdateBalance}
                onStaffTicketPrintingChange={handleUpdateTicket}
                onReceiptPrintingChange={handleUpdateReceipt}
                onReduceMotionChange={handleDisableMotion}
                reduceMotion={Boolean(settings?.disableMotion)}
                staffTicketPrinting={Boolean(settings?.ticketEnabled)}
                receiptPrinting={Boolean(settings?.receiptEnabled)}
                balanceEnabled={Boolean(settings?.balanceEnabled)}
              />
            </div>
          </div>
        </section>

        <MenuSectionDivider />

        <section className="flex w-full justify-center">
          <div className="w-full max-w-2xl">
            <div className="space-y-8">
              <SecuritySection
                onResetPassword={handleResetPassword}
                onDeleteAccount={handleDeleteAccount}
                dayActive={dayActive}
              />

              <ExportDataSection
                onExportPdf={handleExportPdf}
                onExportBackup={handleExportBackup}
                loadingAction={exportLoading}
              />

              <PrivacyPolicySection />
            </div>
          </div>
        </section>
      </div>

      <DotLineDivider className="my-14" />

      <div className="mx-auto w-full max-w-2xl">
        <DataManagementSection
          dayActive={dayActive}
          onClearReports={handleResetReports}
          onResetAllData={handleResetAllData}
          onDeleteArchivedItems={handleDeleteArchivedAll}
          onDeleteArchivedMenuItems={handleDeleteArchivedMenu}
          onDeleteArchivedStockItems={handleDeleteArchivedStock}
        />
      </div>
    </main>
  );
}


/*

"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { useAuth } from "@/firebase/authProvider";
import {
  resetAllData,
  resetReports,
  deleteArchivedMenuAndStockItems,
  deleteArchivedMenuItems,
  deleteArchivedStockItems,
} from "@/firebase/accountData";
import { deleteAccountWithPassword, resetPassword } from "@/firebase/accountAuth";
import {
  updateCurrency,
  updateBalanceOption,
  updateReceiptOption,
  updateTicketOption,
  updateDisableMotion,
} from "@/firebase/userSettings";
import { DotLineDivider, MenuSectionDivider } from "@/components/ui/dividers/Dividers";
import AccountOverviewSection from "@/components/account/AccountOverviewSection";
import PreferencesSection from "@/components/account/PreferencesSection";
import SecuritySection from "@/components/account/SecuritySection";
import ExportDataSection from "@/components/account/ExportDataSection";
import DataManagementSection from "@/components/account/DataManagementSection";
import PrivacyPolicySection from "@/components/account/PrivacyPolicySection";
import AccountExportPdf from "@/components/account/export/AccountExportPdf";
import { buildAccountExportReport } from "@/components/account/export/buildAccountExportReport";
import { exportUserData } from "@/components/account/export/exportUserData";

export default function AccountPage() {
  const { user, profile } = useAuth();
  const [exportLoading, setExportLoading] = useState<"pdf" | "backup" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dayActive = Boolean(profile?.nextillApp?.dayCycle?.active);
  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";
  const settings = profile?.nextillApp?.settings;

  if (!user || !profile) return null;

  function clearFeedback() {
    setError(null);
    setSuccess(null);
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleUpdateBalance() {
    clearFeedback();

    try {
      if(!user)return
      await updateBalanceOption({ uid: user.uid });
      setSuccess("Balance updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update balance.");
    }
  }

  async function handleUpdateTicket() {
    clearFeedback();

    try {
      if(!user) return
      await updateTicketOption({ uid: user.uid });
      setSuccess("Ticket printing updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update ticket printing."
      );
    }
  }

  async function handleUpdateReceipt() {
    clearFeedback();

    try {
      if(!user) return
      await updateReceiptOption({ uid: user.uid });
      setSuccess("Receipt printing updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update receipt printing."
      );
    }
  }

  async function handleDisableMotion() {
    clearFeedback();

    try {
      if(!user) return
      await updateDisableMotion({ uid: user.uid });
      setSuccess("Motion preference updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update motion preference."
      );
    }
  }

  async function handleCurrencyChange(value: string) {
    clearFeedback();
    try{
      if(!user) return
      await updateCurrency({ uid: user.uid, currency: value });
      setSuccess("Currency updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update currency.");
    }
  }

  async function handleResetPassword() {
    if (!user) throw new Error("Missing user.");
    if (!user.email) throw new Error("Missing email.");
    await resetPassword(user.email);
  }

  async function handleDeleteAccount(password: string) {
    if (!user) throw new Error("Missing user.");
    if (dayActive) throw new Error("End the day before deleting the account.");
    if (!user.email) throw new Error("Missing email.");
    if (!password.trim()) throw new Error("Enter your password.");

    await resetAllData(user.uid);
    await deleteAccountWithPassword(user.email, password);
  }

  async function handleResetReports() {
    if(!user) return
    if (dayActive) throw new Error("End the day before resetting the reports.");
    await resetReports(user.uid);
  }

  async function handleResetAllData() {
    if(!user) return
    if (dayActive) throw new Error("End the day before resetting all data.");
    await resetAllData(user.uid);
  }

  async function handleDeleteArchivedMenu() {
    if(!user) return
    if (dayActive) {
      throw new Error("End the day before deleting archived items in the menu.");
    }
    await deleteArchivedMenuItems(user.uid);
  }

  async function handleDeleteArchivedStock() {
    if(!user) return
    if (dayActive) {
      throw new Error("End the day before deleting archived items in the stock.");
    }
    await deleteArchivedStockItems(user.uid);
  }

  async function handleDeleteArchivedAll() {
    if(!user) return
    if (dayActive) {
      throw new Error("End the day before deleting all archived items.");
    }
    await deleteArchivedMenuAndStockItems(user.uid);
  }

  async function handleExportPdf() {
    clearFeedback();
    setExportLoading("pdf");

    try {
      if(!user) return
      const rawData = await exportUserData(user.uid);
      const reportData = buildAccountExportReport({
        ...rawData,
        exportedAt: new Date(),
      });

      const blob = await pdf(<AccountExportPdf data={reportData} />).toBlob();
      const safeDate = new Date().toISOString().replace(/[:.]/g, "-");

      downloadBlob(blob, `nextill-account-report-${safeDate}.pdf`);
      setSuccess("PDF report downloaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export PDF.");
    } finally {
      setExportLoading(null);
    }
  }

  async function handleExportBackup() {
    clearFeedback();
    setExportLoading("backup");

    try {
      if(!user) return
      const data = await exportUserData(user.uid);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const safeDate = new Date().toISOString().replace(/[:.]/g, "-");
      downloadBlob(blob, `nextill-backup-${safeDate}.json`);
      setSuccess("Backup downloaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export backup.");
    } finally {
      setExportLoading(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
      <div className="space-y-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile, preferences, and system settings.
          </p>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
          <div className="w-full max-w-2xl space-y-8">
            <AccountOverviewSection user={user} profile={profile} />

            <PreferencesSection
              currency={currency}
              onCurrencyChange={handleCurrencyChange}
              onBalanceEnabledChange={handleUpdateBalance}
              onStaffTicketPrintingChange={handleUpdateTicket}
              onReceiptPrintingChange={handleUpdateReceipt}
              onReduceMotionChange={handleDisableMotion}
              reduceMotion={Boolean(settings?.disableMotion)}
              staffTicketPrinting={Boolean(settings?.ticketEnabled)}
              receiptPrinting={Boolean(settings?.receiptEnabled)}
              balanceEnabled={Boolean(settings?.balanceEnabled)}
            />
          </div>

          <div className="hidden lg:block">
            <MenuSectionDivider />
          </div>

          <div className="w-full max-w-2xl space-y-8">
            <SecuritySection
              onResetPassword={handleResetPassword}
              onDeleteAccount={handleDeleteAccount}
              dayActive={dayActive}
            />

            <ExportDataSection
              onExportPdf={handleExportPdf}
              onExportBackup={handleExportBackup}
              loadingAction={exportLoading}
            />

            <div className="mx-auto w-full max-w-2xl">
          <PrivacyPolicySection />
        </div>
          </div>
        </div>

        <DotLineDivider className="my-10 lg:my-12" />

        <div className="mx-auto w-full max-w-2xl">
          <DataManagementSection
            dayActive={dayActive}
            onClearReports={handleResetReports}
            onResetAllData={handleResetAllData}
            onDeleteArchivedItems={handleDeleteArchivedAll}
            onDeleteArchivedMenuItems={handleDeleteArchivedMenu}
            onDeleteArchivedStockItems={handleDeleteArchivedStock}
          />
        </div>
      </div>
    </main>
  );
}









*/



