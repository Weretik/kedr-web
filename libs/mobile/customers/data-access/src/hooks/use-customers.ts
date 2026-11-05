import { useLocalDatabase, useLocalDataVersion } from '@mobile/core/local-db';
import { useMemo } from 'react';

import { readCustomerDetails, readCustomers } from '../queries/customer-queries';
import { useSelectedCustomerStore } from '../selection/selected-customer-store';

import type { Customer, CustomerDetails } from '@mobile/customers/model';

/** All synced customers; re-read after every sync. */
export function useCustomers(): Customer[] {
  const db = useLocalDatabase();
  const version = useLocalDataVersion();
  // `version` re-runs the read after a sync.
  return useMemo(() => readCustomers(db), [db, version]);
}

export function useCustomerDetails(counterpartyId: string | null): CustomerDetails | null {
  const db = useLocalDatabase();
  const version = useLocalDataVersion();
  return useMemo(
    () => (counterpartyId ? readCustomerDetails(db, counterpartyId) : null),
    // `version` re-runs the read after a sync.
    [db, counterpartyId, version],
  );
}

/**
 * The chosen customer, or null when none is chosen or the customer left the synced list. The working tabs unlock
 * only for a customer the device knows.
 */
export function useSelectedCustomer(): CustomerDetails | null {
  const selectedId = useSelectedCustomerStore((state) => state.selectedId);
  return useCustomerDetails(selectedId);
}
