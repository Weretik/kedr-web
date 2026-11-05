import { useMobileSession } from '@mobile/core/auth';
import { WorkLayout } from '@mobile/core/shell';

export default function WorkAreaLayout() {
  const session = useMobileSession();
  const user = session.status === 'authenticated' ? session.user : null;

  // The selected customer arrives with the customer stage; until then the gate stays closed.
  return (
    <WorkLayout
      account={user ? { name: user.fullName, photoUrl: user.avatarUrl } : undefined}
      hasCustomer={false}
    />
  );
}
