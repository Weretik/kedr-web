import { useLocalDatabase, useLocalDataVersion, useLocalQuery } from '@mobile/core/local-db';
import { useMemo } from 'react';

import { readCustomerDetails, readCustomers } from '../queries/customer-queries';
import { useSelectedCustomerStore } from '../selection/selected-customer-store';

import type { LocalDatabase } from '@mobile/core/local-db';
import type { Customer, CustomerDetails } from '@mobile/customers/model';

interface DetailsRead {
  counterpartyId: string;
  db: LocalDatabase;
  value: CustomerDetails | null;
  /** Customers and catalog versions: the details name price types and categories from the catalog. */
  version: string;
}

// The shell, the tabs and the open screen all ask for the chosen customer at once; the last read is shared until
// the customer or the local data changes.
let lastRead: DetailsRead | null = null;

function readDetailsShared(
  db: LocalDatabase,
  counterpartyId: string,
  version: string,
): CustomerDetails | null {
  if (
    lastRead?.db === db &&
    lastRead.counterpartyId === counterpartyId &&
    lastRead.version === version
  ) {
    return lastRead.value;
  }
  const value = readCustomerDetails(db, counterpartyId);
  lastRead = { counterpartyId, db, value, version };
  return value;
}

/** All synced customers; re-read after every sync. */
export function useCustomers(): Customer[] {
  return useLocalQuery(['customers'], readCustomers);
}

export function useCustomerDetails(counterpartyId: string | null): CustomerDetails | null {
  const db = useLocalDatabase();
  const version = `${useLocalDataVersion('customers')}:${useLocalDataVersion('catalog')}`;
  return useMemo(
    () => (counterpartyId ? readDetailsShared(db, counterpartyId, version) : null),
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
