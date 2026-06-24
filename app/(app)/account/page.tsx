"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { useAuth } from "@/firebase/authProvider";
import {resetAllData, resetReports, deleteArchivedMenuAndStockItems,
        deleteArchivedMenuItems, deleteArchivedStockItems,} from "@/firebase/accountData";
import { deleteAccountWithPassword, resetPassword } from "@/firebase/accountAuth";
import {updateCurrency, updateBalanceOption, updateReceiptOption,
        updateTicketOption, updateDisableMotion,updateSoundOption,
        updateDiscountOption} from "@/firebase/userSettings";
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
import { useTranslation } from "react-i18next";

export default function AccountPage() {
  const { user, profile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {t} = useTranslation("account")

  if (!user || !profile) return null;

  const uid = user.uid;
  const email = user.email;
  const dayActive = profile?.nextillApp?.dayCycle?.active ?? false;
  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";
  const settings = profile?.nextillApp?.settings;

  function clearFeedback() {
    setError(null);
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  {/*preferences functions */}
  async function handleUpdateBalance() {
    clearFeedback();

    try {
      await updateBalanceOption({ uid });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.updateBalanceFailed"));
    }
  }

  async function handleUpdateTicket() {
    clearFeedback();

    try {
      await updateTicketOption({ uid });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("errors.updateTicketPrintingFailed")
      );
    }
  }

  async function handleUpdateReceipt() {
    clearFeedback();

    try {
      await updateReceiptOption({ uid });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("errors.updateReceiptPrintingFailed")
      );
    }
  }

  async function handleDisableMotion() {
    clearFeedback();

    try {
      await updateDisableMotion({ uid });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("errors.updateMotionPreferenceFailed")
      );
    }
  }

  async function handleEnableSound(){
    clearFeedback()
    try{
      await updateSoundOption({uid})
    }catch(err){
      setError(
        err instanceof Error ? err.message : t("errors.soundError")
      )
    }
  }

  async function handleEnableDiscount(){
    clearFeedback()
    try{
      await updateDiscountOption({uid})
    }catch(err){
      setError(
        err instanceof Error ? err.message : t("errors.discountError")
      )
    }
  }

  async function handleCurrencyChange(value: string) {
    clearFeedback();

    try {
      await updateCurrency({ uid, currency: value });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.updateCurrencyFailed"));
    }
  }


  {/*security functions*/}
  async function handleResetPassword() {
    if (!email) throw new Error(t("errors.missingEmail"));
    await resetPassword(email);
  }

  async function handleDeleteAccount(password: string) {
    if (dayActive) throw new Error(t("errors.endDayBeforeDeletingAccount"));
    if (!email) throw new Error(t("errors.missingEmail"));
    if (!password.trim()) throw new Error(t("errors.enterPassword"));

    await resetAllData(uid);
    await deleteAccountWithPassword(email, password);
  }

  {/*data management functions*/}
  async function handleResetReports() {
    if (dayActive) throw new Error(t("errors.endDayBeforeResettingReports"));
    await resetReports(uid);
  }

  async function handleResetAllData() {
    if (dayActive) throw new Error(t("errors.endDayBeforeResettingAllData"));
    await resetAllData(uid);
  }

  async function handleDeleteArchivedMenu() {
    if (dayActive) {
      throw new Error(t("errors.endDayBeforeDeletingArchivedMenuItems"));
    }
    await deleteArchivedMenuItems(uid);
  }

  async function handleDeleteArchivedStock() {
    if (dayActive) {
      throw new Error(t("errors.endDayBeforeDeletingArchivedStockItems"));
    }
    await deleteArchivedStockItems(uid);
  }

  async function handleDeleteArchivedAll() {
    if (dayActive) {
      throw new Error(t("errors.endDayBeforeDeletingAllArchivedItems"));
    }
    await deleteArchivedMenuAndStockItems(uid);
  }

  {/*export data functions */}
  async function handleExportPdf() {
    const rawData = await exportUserData(uid);
    const reportData = buildAccountExportReport({
      ...rawData,
      exportedAt: new Date(),
    });

    const blob = await pdf(<AccountExportPdf data={reportData} />).toBlob();
    const safeDate = new Date().toISOString().replace(/[:.]/g, "-");

    downloadBlob(blob, `nextill-account-report-${safeDate}.pdf`);
  }

  async function handleExportBackup() {
    const data = await exportUserData(uid);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const safeDate = new Date().toISOString().replace(/[:.]/g, "-");
    downloadBlob(blob, `nextill-backup-${safeDate}.json`);  
  }

  return (
    <main className="w-full px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="relative grid w-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start">
        <section className="flex w-full justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-10 sm:mb-6 lg:mb-10">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("title")}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {t("description")}
              </p>
            </div>

            {error ? (
              <div className={`rounded-xl border border-red-300 bg-red-50
                               px-4 py-3 text-sm text-red-700`}>
                {error}
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
                onSoundEnabledChange={handleEnableSound}
                onDiscountEnabledChange={handleEnableDiscount}
                reduceMotion={settings?.disableMotion ?? false}
                staffTicketPrinting={settings?.ticketEnabled ?? false}
                receiptPrinting={settings?.receiptEnabled ?? false}
                balanceEnabled={settings?.balanceEnabled ?? false}
                soundEnabled={settings?.soundEnabled ?? false}
                discountEnabled={settings?.discountEnabled ?? false}
                dayActive={dayActive}
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




