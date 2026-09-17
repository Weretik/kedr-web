export function formatOrderAmount(amount: number): string {
  if (!Number.isFinite(amount)) return '—';

  return `${new Intl.NumberFormat('uk-UA', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount)} грн.`;
}

export function formatOrderDateTime(createdAtUtc: string): string {
  const date = new Date(createdAtUtc);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
  }).format(date);
}

export function formatOrderPositionCount(lineCount: number): string {
  const absolute = Math.abs(lineCount);
  const mod100 = absolute % 100;
  const mod10 = absolute % 10;
  const noun =
    mod100 >= 11 && mod100 <= 14
      ? 'позицій'
      : mod10 === 1
        ? 'позиція'
        : mod10 >= 2 && mod10 <= 4
          ? 'позиції'
          : 'позицій';

  return `${lineCount} ${noun}`;
}
