import { useMobileSession } from '@mobile/core/auth';
import { useConnectivity, WorkLayout } from '@mobile/core/shell';
import { SyncProvider, SyncStatusStrip } from '@mobile/sync/feature';

export default function WorkAreaLayout() {
  const session = useMobileSession();
  const user = session.status === 'authenticated' ? session.user : null;
  const isOnline = useConnectivity()?.isOnline ?? null;

  // The selected customer arrives with the customer stage; until then the gate stays closed.
  return (
    <SyncProvider isOnline={isOnline}>
      <WorkLayout
        account={user ? { name: user.fullName, photoUrl: user.avatarUrl } : undefined}
        hasCustomer={false}
        statusStrip={(layout) => <SyncStatusStrip isOnline={isOnline} layout={layout} />}
      />
    </SyncProvider>
  );
}
