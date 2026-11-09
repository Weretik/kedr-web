import { useLocalDatabase, useLocalQuery } from '@mobile/core/local-db';
import { useQuery } from '@tanstack/react-query';

import {
  fetchCustomerActivity,
  type CustomerActivityFetcher,
} from '../activity/customer-activity-client';
import { readCachedActivity, saveActivity } from '../activity/customer-activity-store';

import type { CustomerActivity } from '@mobile/customers/model';

export interface CustomerActivityState {
  activity: CustomerActivity | null;
  /** True while the newest orders and drafts are being read online. */
  loading: boolean;
  /** True when the last online read failed; the cached lists, if any, stay on screen. */
  failed: boolean;
}

/**
 * Shows the saved orders and drafts at once and refreshes them from the order workspace while online and each time
 * the screen opens (R-004, R-013). Offline the card keeps the last lists with their time.
 */
export function useCustomerActivity(
  counterpartyId: string,
  isOnline: boolean | null,
  fetcher: CustomerActivityFetcher = fetchCustomerActivity,
  now: () => number = Date.now,
): CustomerActivityState {
  const db = useLocalDatabase();
  // The saved copy is read once per customer; the query result replaces it after a refresh.
  const saved = useLocalQuery([], (database) => readCachedActivity(database, counterpartyId));
  const query = useQuery({
    enabled: isOnline === true,
    queryFn: async () => {
      const activity = { ...(await fetcher(counterpartyId)), fetchedAt: now() };
      saveActivity(db, counterpartyId, activity);
      return activity;
    },
    queryKey: ['customer-activity', counterpartyId],
    staleTime: 0,
  });

  return {
    activity: query.data ?? saved,
    failed: query.isError,
    loading: query.isFetching,
  };
}
