import { articlesRoutes } from '@admin/articles/feature';
import { createCatalogAttributesRoutes } from '@admin/catalog-attributes/feature';
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
import { createDashboardRoutes } from '@admin/dashboard/feature';
import { documentsRoutes } from '@admin/documents/feature';
import { galleryRoutes } from '@admin/gallery/feature';
import { homeContentRoutes } from '@admin/home-content/feature';
import { createMediaRoutes } from '@admin/media/feature';
import {
  addProductToCurrentOrder,
  clearCurrentOrder,
  createOrdersRoutes,
  CustomerOrdersPanel,
  useCurrentOrderSet,
} from '@admin/orders/feature';
import { pageSeoRoutes } from '@admin/page-seo/feature';
import { createProductsRoutes } from '@admin/products/feature';
import { createSiteModelsRoutes } from '@admin/site-models/feature';
import { SiteRefreshButton } from '@admin/site-refresh/feature';
import { createProfileRoutes, createUsersRoutes, profilePath } from '@admin/users/feature';
import { wholesaleContentRoutes } from '@admin/wholesale-content/feature';
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
      <AdminLayout currentOrderPositionCount={lines.length} topBarActions={<SiteRefreshButton />} />
    </AdminShellSessionProvider>
  );
}

const usersRoutes = createUsersRoutes({ useCurrentUserId: useSignedInUserId });
const profileRoutes = createProfileRoutes({ onProfileChanged: refreshSession });
const categoriesRoutes = createCategoriesRoutes({ useCanEditCatalog });
const catalogAttributesRoutes = createCatalogAttributesRoutes({ useCanEditCatalog });
const siteModelsRoutes = createSiteModelsRoutes();
const mediaRoutes = createMediaRoutes({ useCanDelete: useCanDeleteMedia });
const dashboardRoutes = createDashboardRoutes({
  siteRefreshAction: <SiteRefreshButton variant="text" />,
  useViewerName: useSignedInUserName,
});

function useCanEditCatalog(): boolean {
  const session = useAdminSession();
  return session.status === 'authenticated' && canEditCatalog(session.user);
}

function useCanDeleteMedia(): boolean {
  const session = useAdminSession();
  return session.status === 'authenticated' && canDeleteMedia(session.user);
}

function useSignedInUserName(): string | null {
  const session = useAdminSession();
  return session.status === 'authenticated' ? session.user.fullName : null;
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
        ...siteModelsRoutes,
        ...catalogAttributesRoutes,
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
        ...homeContentRoutes,
        ...wholesaleContentRoutes,
        ...pageSeoRoutes,
        ...profileRoutes,
        { element: <RequireRole allow={canManageRequisites} />, children: companyAdminRoutes },
        { element: <RequireRole allow={canManageUsers} />, children: usersRoutes },
      ],
    },
    { path: '*', element: <Navigate replace to="/dashboard" /> },
  ]);
}
