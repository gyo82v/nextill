"use client";

import { useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { exportUserData } from "@/firebase/exportData";
import { resetAllData, resetReports, deleteArchivedMenuAndStockItems, deleteArchivedMenuItems, deleteArchivedStockItems } from "@/firebase/accountData";
import {deleteAccountWithPassword, resetPassword,} from "@/firebase/accountAuth";
import { updateCurrency, updateBalanceOption, updateReceiptOption, updateTicketOption, updateDisableMotion } from "@/firebase/userSettings";
import AccountOverviewSection from "@/components/account/AccountOverviewSection";
import PreferencesSection from "@/components/account/PreferencesSection";
import SecuritySection from "@/components/account/SecuritySection";
import ExportDataSection from "@/components/account/ExportDataSection";
import DataManagementSection from "@/components/account/DataManagementSection";
import PrivacyPolicySection from "@/components/account/PrivacyPolicySection";

export default function AccountPage() {
  const { user, profile } = useAuth();
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dayActive = Boolean(profile?.nextillApp?.dayCycle?.active);
  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";

  if (!user || !profile) return null;

  {/*preferences functions*/}
  async function handleUpdateBalance(){
    setError(null);
    setSuccess(null);
    try{
      if(!user) return
      await updateBalanceOption({uid: user.uid})
      setSuccess("balance updated.")
    }catch(err){
      setError(err instanceof Error ? err.message : "Failed to update balance.");
    }
  }

  async function handleUpdateTicket(){
    setError(null);
    setSuccess(null);
    try{
      if(!user) return
      await updateTicketOption({uid: user.uid})
      setSuccess("balance updated.")
    }catch(err){
      setError(err instanceof Error ? err.message : "Failed to update ticket printing.");
    }
  }

  async function handleUpdateReceipt(){
    setError(null);
    setSuccess(null);
    try{
      if(!user) return
      await updateReceiptOption({uid: user.uid})
      setSuccess("balance updated.")
    }catch(err){
      setError(err instanceof Error ? err.message : "Failed to update receipt printing.");
    }
  }

  async function handleDisableMotion(){
    setError(null);
    setSuccess(null);
    try{
      if(!user) return
      await updateDisableMotion({uid: user.uid})
      setSuccess("balance updated.")
    }catch(err){
      setError(err instanceof Error ? err.message : "Failed to update disable motion.");
    }
  }

  {/*security functions*/}
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

  {/*data management functions*/}

  async function handleResetReports(){
    if(!user) throw new Error("Missing user.")
    if(!dayActive) throw new Error("End the day before resetting the reports.")
    await resetReports(user.uid)
  }

  async function handleResetAllData() {
    if (!user) throw new Error("Missing user.");
    if (dayActive) throw new Error("End the day before resetting all data.");
    await resetAllData(user.uid);
  }

  async function handleDeleteArchievedMenu() {
    if (!user) throw new Error("Missing user.");
    if (dayActive) throw new Error("End the day before deleting archieved items in the menu.");
    await deleteArchivedMenuItems(user.uid);
  }

  async function handleDeleteArchievedStock() {
    if (!user) throw new Error("Missing user.");
    if (dayActive) throw new Error("End the day before deleting archieved items in the stock.");
    await deleteArchivedStockItems(user.uid);
  }

  async function handleDeleteArchievedAll() {
    if (!user) throw new Error("Missing user.");
    if (dayActive) throw new Error("End the day before deleting all archieved items.");
    await deleteArchivedMenuAndStockItems(user.uid);
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

      {/*Profile*/}
      <AccountOverviewSection user={user} profile={profile} />

      {/*Preferences*/}
      <PreferencesSection 
        currency={currency} 
        onCurrencyChange={handleCurrencyChange} 
        onBalanceEnabledChange={handleUpdateBalance}
        onStaffTicketPrintingChange={handleUpdateTicket}
        onReceiptPrintingChange={handleUpdateReceipt}
        onReduceMotionChange={handleDisableMotion}
      />

      {/*Security*/}
      <SecuritySection 
        onResetPassword={handleResetPassword}
        onDeleteAccount={handleDeleteAccount}
        dayActive={dayActive}
      />
     
      {/*Export data*/}
      <ExportDataSection handleExportData={handleExportData} exportLoading={exportLoading}  />

      {/*Data management*/}
      <DataManagementSection 
        dayActive={dayActive}
        onClearReports={handleResetReports}
        onResetAllData={handleResetAllData}  
        onDeleteArchivedItems={handleDeleteArchievedAll}
        onDeleteArchivedMenuItems={handleDeleteArchievedMenu}
        onDeleteArchivedStockItems={handleDeleteArchievedStock}
      />

      {/*Privacy policy*/}
      <PrivacyPolicySection />
    </div>
  );
}


/*









*/



