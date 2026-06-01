export function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    currencyDisplay: "symbol"
  }).format(amountMinor / 100);
}

export function moneyToMinorUnits(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) return null;

  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;

  return Math.round(value * 100);
}


