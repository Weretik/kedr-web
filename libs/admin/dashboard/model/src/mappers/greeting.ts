/** Greeting by the viewer's local hour, with the first word of the full name. */
export function greeting(now: Date, fullName: string | null | undefined): string {
  const hour = now.getHours();
  const phrase =
    hour < 5 || hour >= 18 ? 'Доброго вечора' : hour < 12 ? 'Доброго ранку' : 'Доброго дня';
  const firstName = fullName?.trim().split(/\s+/)[0];
  return firstName ? `${phrase}, ${firstName}` : phrase;
}

/** The current Kyiv calendar day as `YYYY-MM-DD`, the format of the order date filters. */
export function kyivDate(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}
