"use client";

import LanguageToggle from "@/components/language-toggle";
import Select from "@/components/ui/select";
import Switch from "@/components/ui/Switch";
import AccountSectionCard from "./AccountSectionCard";
import SettingRow from "./SettingRow";

type PreferencesSectionProps = {
  currency: string;
  onCurrencyChange: (newCurrency: string) => void;

  reduceMotion?: boolean;
  onReduceMotionChange?: (nextValue: boolean) => void;

  staffTicketPrinting?: boolean;
  onStaffTicketPrintingChange?: (nextValue: boolean) => void;

  receiptPrinting?: boolean;
  onReceiptPrintingChange?: (nextValue: boolean) => void;

  balanceEnabled?: boolean;
  onBalanceEnabledChange?: (nextValue: boolean) => void;
};

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
}: PreferencesSectionProps) {
  return (
    <AccountSectionCard
      title="Preferences"
      description="Manage language, currency, and how the app behaves."
    >
      <div className="space-y-8">
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Localization
          </h3>

          <div className="space-y-3">
            <SettingRow
              label="Language"
              description="Change the app language."
            >
              <LanguageToggle />
            </SettingRow>

            <SettingRow
              label="Currency"
              description="Choose the default currency used across the app."
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
            System behavior
          </h3>

          <div className="space-y-3">
            <SettingRow
              label="Disable motion"
              description="Reduce animated transitions and motion effects throughout the app."
            >
              <Switch
                checked={reduceMotion ?? false}
                onCheckedChange={(nextValue) => {
                  onReduceMotionChange?.(nextValue);
                }}
                disabled={!onReduceMotionChange}
                aria-label="Disable motion"
              />
            </SettingRow>

            <SettingRow
              label="Staff ticket printing"
              description="Print the staff ticket sent to the kitchen or bar."
            >
              <Switch
                checked={staffTicketPrinting ?? false}
                onCheckedChange={(nextValue) => {
                  onStaffTicketPrintingChange?.(nextValue);
                }}
                disabled={!onStaffTicketPrintingChange}
                aria-label="Staff ticket printing"
              />
            </SettingRow>

            <SettingRow
              label="Customer receipt printing"
              description="Print the receipt for the customer."
            >
              <Switch
                checked={receiptPrinting ?? false}
                onCheckedChange={(nextValue) => {
                  onReceiptPrintingChange?.(nextValue);
                }}
                disabled={!onReceiptPrintingChange}
                aria-label="Customer receipt printing"
              />
            </SettingRow>

            <SettingRow
              label="Start/end balance"
              description="Enable the opening and closing balance system."
            >
              <Switch
                checked={balanceEnabled ?? false}
                onCheckedChange={(nextValue) => {
                  onBalanceEnabledChange?.(nextValue);
                }}
                disabled={!onBalanceEnabledChange}
                aria-label="Start and end balance"
              />
            </SettingRow>
          </div>
        </section>
      </div>
    </AccountSectionCard>
  );
}

/*

import LanguageToggle from "@/components/language-toggle";
import Select from "../ui/select";

export default function PreferencesSection({currency, handleCurrencyChange}:{currency:string, handleCurrencyChange:(newCurrency:string) => void}){
    return(
        <section>
          <h2>Preferences</h2>
          <div className="">
            <div>
              <label>Currency</label>
              <Select.Root value={currency} onValueChange={handleCurrencyChange} className="w-full">
                <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="EUR">EUR (€)</Select.Item>
                    <Select.Item value="USD">USD ($)</Select.Item>
                    <Select.Item value="GBP">GBP (£)</Select.Item>
                    <Select.Item value="AUD">AUD ($)</Select.Item>
                    <Select.Item value="CAD">CAD ($)</Select.Item>
                  </Select.Content>
              </Select.Root>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Language</label>
              <LanguageToggle />
            </div>
            <div>
                <label>Disable motion</label>
                <p>disable toggle here</p>
            </div>
            <div>
                <label>Disable/enable printing</label>
                <p>disable/enable printing toggle here</p>
                <label>disable ticket printing</label>
                <p>disable ticket printing toggle here</p>
                <label>disable receipt printing</label>
                <p>disable receipt printing toggle here</p>
            </div>
            <div>
                <label>Disable/enable balance</label>
                <p>disable/enable balance toggle here</p>
            </div>
          </div>
        </section>
    )
}




*/