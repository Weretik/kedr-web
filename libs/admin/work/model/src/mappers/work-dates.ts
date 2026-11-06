const dayTime = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
  timeZone: 'Europe/Kyiv',
});

const time = new Intl.DateTimeFormat('uk-UA', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Kyiv',
});

const longDay = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  weekday: 'long',
});

/** «6 лист., 14:05» in Kyiv time. */
export const formatWorkDayTime = (iso: string): string => dayTime.format(new Date(iso));

/** «14:05» in Kyiv time. */
export const formatWorkTime = (iso: string): string => time.format(new Date(iso));

/** «четвер, 6 листопада» for a `yyyy-mm-dd` day. */
export const formatWorkDay = (day: string): string => longDay.format(new Date(`${day}T12:00:00Z`));
