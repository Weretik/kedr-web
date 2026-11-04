import { articlesRoutes } from '@admin/articles/feature';
import { createCategoriesRoutes } from '@admin/categories/feature';
import { createClientsRoutes } from '@admin/clients/feature';
import { companyAdminRoutes, companyRoutes } from '@admin/company/feature';
import {
  canEditCatalog,
  canDeleteMedia,
  canManageRequisites,
  canManageUsers,
  LoginPage,
  loginPath,
  logout,
  refreshSession,
  RequireAdminSession,
  RequireRole,
  useAdminSession,
} from '@admin/core/auth';
import { AdminLayout, AdminShellSessionProvider } from '@admin/core/shell';
import { dashboardRoutes } from '@admin/dashboard/feature';
import { documentsRoutes } from '@admin/documents/feature';
import { galleryRoutes } from '@admin/gallery/feature';
import { createMediaRoutes } from '@admin/media/feature';
import {
  addProductToCurrentOrder,
  clearCurrentOrder,
  createOrdersRoutes,
  CustomerOrdersPanel,
  useCurrentOrderSet,
} from '@admin/orders/feature';
import { createProductsRoutes } from '@admin/products/feature';
import { createProfileRoutes, createUsersRoutes, profilePath } from '@admin/users/feature';
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
      profileHref={profilePath}
      user={toShellUser(user)}
    >
      <AdminLayout currentOrderPositionCount={lines.length} />
    </AdminShellSessionProvider>
  );
}

const usersRoutes = createUsersRoutes({ useCurrentUserId: useSignedInUserId });
const profileRoutes = createProfileRoutes({ onProfileChanged: refreshSession });
const categoriesRoutes = createCategoriesRoutes({ useCanEditCatalog });
const mediaRoutes = createMediaRoutes({ useCanDelete: useCanDeleteMedia });

function useCanEditCatalog(): boolean {
  const session = useAdminSession();
  return session.status === 'authenticated' && canEditCatalog(session.user);
}

function useCanDeleteMedia(): boolean {
  const session = useAdminSession();
  return session.status === 'authenticated' && canDeleteMedia(session.user);
}

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
          useCanEditCatalog,
        }),
        ...categoriesRoutes,
        ...createOrdersRoutes({ CustomerPicker }),
        ...createClientsRoutes({
          renderOrdersPanel: (counterpartyId, returnTo) => (
            <CustomerOrdersPanel counterpartyId={counterpartyId} returnTo={returnTo} />
          ),
        }),
        ...mediaRoutes,
        ...articlesRoutes,
        ...companyRoutes,
        ...documentsRoutes,
        ...galleryRoutes,
        ...profileRoutes,
        { element: <RequireRole allow={canManageRequisites} />, children: companyAdminRoutes },
        { element: <RequireRole allow={canManageUsers} />, children: usersRoutes },
      ],
    },
    { path: '*', element: <Navigate replace to="/dashboard" /> },
  ]);
}
