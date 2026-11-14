/** How long the app works from the saved session without reaching the server (owner, 2026-11-05). */
export const offlineWindowDays = 7;

const dayMs = 24 * 60 * 60 * 1000;

/** True while the last successful sign-in or refresh is at most seven days old. */
export function isWithinOfflineWindow(lastRefreshedAt: number, now: number): boolean {
  const age = now - lastRefreshedAt;

  return age >= 0 && age <= offlineWindowDays * dayMs;
}
