export function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    currencyDisplay: "symbol"
  }).format(amountMinor / 100);
}


