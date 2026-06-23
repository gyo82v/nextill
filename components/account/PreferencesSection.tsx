"use client";

import LanguageToggle from "@/components/language-toggle";
import Select from "@/components/ui/select";
import Switch from "@/components/ui/Switch";
import AccountSectionCard from "./AccountSectionCard";
import SettingRow from "./SettingRow";
import type { PreferencesSectionProps } from "@/types";
import { useTranslation } from "react-i18next";

export default function PreferencesSection({
  currency,
  onCurrencyChange,
  reduceMotion,
  onReduceMotionChange,
  staffTicketPrinting,
  onStaffTicketPrintingChange,
  receiptPrinting,
  onReceiptPrintingChange,
  balanceEnabled,
  onBalanceEnabledChange,
  soundEnabled,
  onSoundEnabledChange,
  dayActive
}: PreferencesSectionProps) {
  const {t} = useTranslation("account")
  return (
    <AccountSectionCard
      title={t("preferences.title")}
      description={t("preferences.description")}
    >
      <div className="space-y-8">
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("preferences.localization.title")}
          </h3>

          <div className="space-y-3">
            <SettingRow
              label={t("preferences.localization.language.label")}
              description={t("preferences.localization.language.description")}
            >
              <LanguageToggle />
            </SettingRow>

            <SettingRow
              label={t("preferences.localization.currency.label")}
              description={t("preferences.localization.currency.description")}
            >
              <Select.Root
                value={currency}
                onValueChange={onCurrencyChange}
                className="w-full sm:w-56"
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="EUR">EUR (€)</Select.Item>
                  <Select.Item value="USD">USD ($)</Select.Item>
                  <Select.Item value="GBP">GBP (£)</Select.Item>
                  <Select.Item value="AUD">AUD ($)</Select.Item>
                  <Select.Item value="CAD">CAD ($)</Select.Item>
                </Select.Content>
              </Select.Root>
            </SettingRow>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("preferences.system.title")}
          </h3>

          <div className="space-y-3">
            <SettingRow
              label={t("preferences.system.disableMotion.label")}
              description={t("preferences.system.disableMotion.description")}
            >
              <Switch
                checked={reduceMotion ?? false}
                onCheckedChange={(nextValue) => {
                  onReduceMotionChange?.(nextValue);
                }}
                disabled={!onReduceMotionChange}
                aria-label={t("preferences.system.disableMotion.label")}
              />
            </SettingRow>

            <SettingRow
              label={t("preferences.system.staffTicketPrinting.label")}
              description={t("preferences.system.staffTicketPrinting.description")}
            >
              <Switch
                checked={staffTicketPrinting ?? false}
                onCheckedChange={(nextValue) => {
                  onStaffTicketPrintingChange?.(nextValue);
                }}
                disabled={!onStaffTicketPrintingChange}
                aria-label={t("preferences.system.staffTicketPrinting.label")}
              />
            </SettingRow>

            <SettingRow
              label={t("preferences.system.customerReceiptPrinting.label")}
              description={t("preferences.system.customerReceiptPrinting.description")}
            >
              <Switch
                checked={receiptPrinting ?? false}
                onCheckedChange={(nextValue) => {
                  onReceiptPrintingChange?.(nextValue);
                }}
                disabled={!onReceiptPrintingChange}
                aria-label={t("preferences.system.customerReceiptPrinting.label")}
              />
            </SettingRow>

            <SettingRow
              label={t("preferences.system.openingClosingBalance.label")}
              description={dayActive ? t("preferences.system.openingClosingBalance.disabled") :
                                       t("preferences.system.openingClosingBalance.description")}
              disabled={dayActive}
            >
              <Switch
                checked={balanceEnabled ?? false}
                onCheckedChange={(nextValue) => {
                  onBalanceEnabledChange?.(nextValue);
                }}
                disabled={!onBalanceEnabledChange || dayActive}
                aria-label={t("preferences.system.openingClosingBalance.label")}
              />
            </SettingRow>

            <SettingRow
              label={t("preferences.system.sound.label")}
              description={t("preferences.system.sound.description")}
            >
              <Switch
                checked={soundEnabled ?? false}
                onCheckedChange={(nextValue) => {
                  onSoundEnabledChange?.(nextValue);
                }}
                disabled={!onSoundEnabledChange}
                aria-label={t("preferences.system.sound.label")}
              />
            </SettingRow>
          </div>
        </section>
      </div>
    </AccountSectionCard>
  );
}
