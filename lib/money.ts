export function formatMoney(amountMinor: number, currency: string, locale = "en-US") {

  return new Intl.NumberFormat(locale, {style: "currency",currency})
  .format(amountMinor / 100);

}