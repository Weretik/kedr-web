import { useKeepEssentialPhotos } from '@mobile/catalog/feature';
import { useMobileSession } from '@mobile/core/auth';
import { LocalDatabaseProvider } from '@mobile/core/local-db';
import { useConnectivity, WorkLayout } from '@mobile/core/shell';
import { useSelectedCustomerSummary } from '@mobile/customers/feature';
import { SyncProvider, SyncStatusStrip } from '@mobile/sync/feature';

export default function WorkAreaLayout() {
  const connectivity = useConnectivity();
  const isOnline = connectivity?.isOnline ?? null;

  return (
    <LocalDatabaseProvider>
      <SyncProvider isOnline={isOnline}>
        <WorkArea isOnline={isOnline} isUnmetered={connectivity?.isUnmetered ?? false} />
      </SyncProvider>
    </LocalDatabaseProvider>
  );
}

function WorkArea({
  isOnline,
  isUnmetered,
}: Readonly<{ isOnline: boolean | null; isUnmetered: boolean }>) {
  const session = useMobileSession();
  const user = session.status === 'authenticated' ? session.user : null;
  // Products, calculation and orders open only for a customer the synced data knows (R-002).
  const hasCustomer = useSelectedCustomerSummary() !== null;
  // Main photos and schemes go to the device on Wi‑Fi after each catalog version (R-008).
  useKeepEssentialPhotos(isUnmetered);

  return (
    <WorkLayout
      account={user ? { name: user.fullName, photoUrl: user.avatarUrl } : undefined}
      hasCustomer={hasCustomer}
      statusStrip={(layout) => <SyncStatusStrip isOnline={isOnline} layout={layout} />}
    />
  );
}
