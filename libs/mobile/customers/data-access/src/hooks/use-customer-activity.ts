import { useLocalDatabase } from '@mobile/core/local-db';
import { useEffect, useEffectEvent, useState } from 'react';

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
 * Shows the cached orders and drafts at once and refreshes them from the order workspace while online
 * (R-004, R-013). Offline the card keeps the last lists with their time. Key the caller by `counterpartyId`.
 */
export function useCustomerActivity(
  counterpartyId: string,
  isOnline: boolean | null,
  fetcher: CustomerActivityFetcher = fetchCustomerActivity,
  now: () => number = Date.now,
): CustomerActivityState {
  const db = useLocalDatabase();
  const [state, setState] = useState<CustomerActivityState>(() => ({
    activity: readCachedActivity(db, counterpartyId),
    failed: false,
    // The card is keyed by customer, so a first online read starts as loading.
    loading: isOnline === true,
  }));

  const refresh = useEffectEvent((isActive: () => boolean) => {
    fetcher(counterpartyId)
      .then((lists) => {
        const activity = { ...lists, fetchedAt: now() };
        saveActivity(db, counterpartyId, activity);
        if (isActive()) setState({ activity, failed: false, loading: false });
      })
      .catch(() => {
        if (isActive()) setState((current) => ({ ...current, failed: true, loading: false }));
      });
  });

  useEffect(() => {
    if (isOnline !== true) return;
    let active = true;
    refresh(() => active);
    return () => {
      active = false;
    };
  }, [db, counterpartyId, isOnline]);

  return state;
}
