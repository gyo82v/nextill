import LanguageToggle from "@/components/language-toggle";
import { useMemo } from "react";

export default function PreferencesSection({currency, handleCurrencyChange}:{currency:string, handleCurrencyChange:(newCurrency:string) => void}){
    const currencyOptions = useMemo(
        () => [
          { value: "EUR", label: "EUR (€)" },
          { value: "USD", label: "USD ($)" },
          { value: "GBP", label: "GBP (£)" },
          { value: "AUD", label: "AUD ($)" },
          { value: "CAD", label: "CAD ($)" },
        ],[]
    );
    return(
        <section>
          <h2>Preferences</h2>
          <div className="">
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
            <div>
                <label>Disable motion</label>
                <p>disable here</p>
            </div>
            <div>
                <label>Disable/enable printing</label>
                <p>disable/enable printing here</p>
                <label>disable ticket printing</label>
                <p>disable ticket printing here</p>
                <label>disable receipt printing</label>
                <p>disable receipt printing here</p>
            </div>
            <div>
                <label>Disable/enable balance</label>
                <p>disable/enable balance here</p>
            </div>
          </div>
        </section>
    )
}