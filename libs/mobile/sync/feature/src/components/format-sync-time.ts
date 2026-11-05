/** «14:05» for today, «03.11 14:05» for an earlier day, in the device's time zone. */
export function formatSyncTime(syncedAt: number, now: number): string {
  const date = new Date(syncedAt);
  const today = new Date(now);
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  return sameDay ? time : `${pad(date.getDate())}.${pad(date.getMonth() + 1)} ${time}`;
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}
