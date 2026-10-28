import { createClientsRoutes } from '@admin/clients/feature';
import {
  canManageUsers,
  LoginPage,
  loginPath,
  logout,
  RequireAdminSession,
  RequireRole,
  useAdminSession,
} from '@admin/core/auth';
import { AdminLayout, AdminShellSessionProvider } from '@admin/core/shell';
import { dashboardRoutes } from '@admin/dashboard/feature';
import {
  addProductToCurrentOrder,
  clearCurrentOrder,
  createOrdersRoutes,
  CustomerOrdersPanel,
  useCurrentOrderSet,
} from '@admin/orders/feature';
import { createProductsRoutes } from '@admin/products/feature';
import { createUsersRoutes } from '@admin/users/feature';
import { Navigate, useRoutes } from 'react-router-dom';

import { CustomerPicker } from '../customer-picker';
import { toShellUser } from './shell-user';

import type { SessionUser } from '@admin/core/auth';

function AdminShellRoute({ user }: { user: SessionUser }) {
  const { lines } = useCurrentOrderSet();
  return (
    <AdminShellSessionProvider
      onLogout={async () => {
        clearCurrentOrder();
        await logout();
      }}
      user={toShellUser(user)}
    >
      <AdminLayout currentOrderPositionCount={lines.length} />
    </AdminShellSessionProvider>
  );
}

const usersRoutes = createUsersRoutes({ useCurrentUserId: useSignedInUserId });

function useSignedInUserId(): string | null {
  const session = useAdminSession();
  return session.status === 'authenticated' ? session.user.id : null;
}

export function AppRouter() {
  return useRoutes([
    { path: loginPath, element: <LoginPage /> },
    {
      element: (
        <RequireAdminSession>{(user) => <AdminShellRoute user={user} />}</RequireAdminSession>
      ),
      children: [
        { index: true, element: <Navigate replace to="/dashboard" /> },
        ...dashboardRoutes,
        ...createProductsRoutes({
          onAddProduct: (productId) => addProductToCurrentOrder(String(productId)),
        }),
        ...createOrdersRoutes({ CustomerPicker }),
        ...createClientsRoutes({
          renderOrdersPanel: (counterpartyId, returnTo) => (
            <CustomerOrdersPanel counterpartyId={counterpartyId} returnTo={returnTo} />
          ),
        }),
        { element: <RequireRole allow={canManageUsers} />, children: usersRoutes },
      ],
    },
    { path: '*', element: <Navigate replace to="/dashboard" /> },
  ]);
}
