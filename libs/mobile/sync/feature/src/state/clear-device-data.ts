import { getLocalDatabase, wipeLocalDatabase } from '@mobile/core/local-db';

import { syncStatusActions } from './sync-status-store';

/** Empties the device copy of the catalog and customers on sign-out, so the next account starts clean. */
export function clearDeviceData(): void {
  wipeLocalDatabase(getLocalDatabase());
  syncStatusActions.reset();
}
