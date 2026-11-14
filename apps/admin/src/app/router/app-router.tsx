import { articlesRoutes } from '@admin/articles/feature';
import { CatalogDictionaryTab } from '@admin/catalog-attributes/feature';
import { createCategoriesRoutes } from '@admin/categories/feature';
import { createClientsRoutes } from '@admin/clients/feature';
import { companyAdminRoutes, companyRoutes } from '@admin/company/feature';
import {
  canManageRequisites,
  canManageUsers,
  LoginPage,
  loginPath,
  refreshSession,
  RequireAdminSession,
  RequireRole,
} from '@admin/core/auth';
import { NotFoundPage } from '@admin/core/shell';
import { createDashboardRoutes } from '@admin/dashboard/feature';
import { documentsRoutes } from '@admin/documents/feature';
import { galleryRoutes } from '@admin/gallery/feature';
import { homeContentRoutes } from '@admin/home-content/feature';
import { createMediaRoutes } from '@admin/media/feature';
import {
  addProductToCurrentOrder,
  createOrdersRoutes,
  CustomerOrdersPanel,
} from '@admin/orders/feature';
import { pageSeoRoutes } from '@admin/page-seo/feature';
import { createProductsRoutes } from '@admin/products/feature';
import { seoSettingsRoutes } from '@admin/seo-settings/feature';
import { createSiteModelsRoutes } from '@admin/site-models/feature';
import { SiteRefreshButton } from '@admin/site-refresh/feature';
import { createProfileRoutes, createUsersRoutes } from '@admin/users/feature';
import { wholesaleContentRoutes } from '@admin/wholesale-content/feature';
import { createMyTasksRoutes, createWorkReportRoutes, MyTasksOverview } from '@admin/work/feature';
import { Navigate, useRoutes } from 'react-router-dom';

import { AdminShellRoute } from './admin-shell-route';
import { CustomerPicker } from '../slots/customer-picker/customer-picker';
import {
  useCanDeleteMedia,
  useCanEditCatalog,
  useSignedInUserId,
  useSignedInUserName,
} from '../slots/session/use-session-permissions';
import { useStaffMembers, useWorkAssignees } from '../slots/work/use-staff-members';

const usersRoutes = createUsersRoutes({ useCurrentUserId: useSignedInUserId });
const profileRoutes = createProfileRoutes({ onProfileChanged: refreshSession });
const categoriesRoutes = createCategoriesRoutes({ useCanEditCatalog });
const siteModelsRoutes = createSiteModelsRoutes({
  useCanEditCatalog,
  renderDictionaryTab: (props) => <CatalogDictionaryTab {...props} />,
});
const mediaRoutes = createMediaRoutes({ useCanDelete: useCanDeleteMedia });
const dashboardRoutes = createDashboardRoutes({
  siteRefreshAction: <SiteRefreshButton variant="text" />,
  useViewerName: useSignedInUserName,
  workTasksCard: <MyTasksOverview />,
});

const workReportRoutes = createWorkReportRoutes({ useStaffMembers });
const myTasksRoutes = createMyTasksRoutes({ useAssignees: useWorkAssignees });

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
        ...seoSettingsRoutes,
        ...profileRoutes,
        ...myTasksRoutes,
        { element: <RequireRole allow={canManageRequisites} />, children: companyAdminRoutes },
        { element: <RequireRole allow={canManageUsers} />, children: usersRoutes },
        { element: <RequireRole allow={canManageUsers} />, children: workReportRoutes },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);
}
