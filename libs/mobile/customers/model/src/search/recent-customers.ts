export const maxRecentCustomers = 8;

/** Puts the customer first in the recent list without duplicates, keeping at most eight. */
export function pushRecent(recent: readonly string[], counterpartyId: string): string[] {
  return [counterpartyId, ...recent.filter((id) => id !== counterpartyId)].slice(
    0,
    maxRecentCustomers,
  );
}
