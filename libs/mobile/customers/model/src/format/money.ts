const hryvnias = new Intl.NumberFormat('uk-UA', {
  currency: 'UAH',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: 'currency',
});

/** «1 250,00 ₴»; null (no 1C data yet) is «—». */
export function formatKopecks(kopecks: number | null): string {
  return kopecks === null ? '—' : hryvnias.format(kopecks / 100);
}

/** Amounts the order workspace sends in hryvnias. */
export function formatHryvnias(amount: number): string {
  return hryvnias.format(amount);
}

/** «05.11.2026» in the device's time zone. */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}
