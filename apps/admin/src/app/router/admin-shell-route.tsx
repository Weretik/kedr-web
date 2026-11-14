import { logout } from '@admin/core/auth';
import { AdminLayout, AdminShellSessionProvider } from '@admin/core/shell';
import { clearCurrentOrder, useCurrentOrderSet } from '@admin/orders/feature';
import { SiteRefreshButton } from '@admin/site-refresh/feature';
import { profilePath } from '@admin/users/feature';

import { toShellUser } from './shell-user';

import type { SessionUser } from '@admin/core/auth';

/** The signed-in shell: layout, current order counter, and logout that also clears the current order. */
export function AdminShellRoute({ user }: { user: SessionUser }) {
  const { lines } = useCurrentOrderSet();
  return (
    <AdminShellSessionProvider
      onLogout={async () => {
        clearCurrentOrder();
        await logout();
      }}
      profileHref={profilePath}
      user={toShellUser(user)}
    >
      <AdminLayout currentOrderPositionCount={lines.length} topBarActions={<SiteRefreshButton />} />
    </AdminShellSessionProvider>
  );
}
