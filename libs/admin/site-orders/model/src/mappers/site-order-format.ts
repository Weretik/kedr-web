const dateTime = new Intl.DateTimeFormat('uk-UA', {
  timeZone: 'Europe/Kyiv',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
const money = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** «24.11.2026, 10:45» in Kyiv time; «—» when there is no time. */
export function formatSiteOrderTime(value: string | null): string {
  return value ? dateTime.format(new Date(value)) : '—';
}

/** Hryvnia amount with two decimals, without the currency sign (the column says «грн»). */
export function formatSiteOrderMoney(value: number): string {
  return money.format(value);
}
