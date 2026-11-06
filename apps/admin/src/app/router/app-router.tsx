import { articlesRoutes } from '@admin/articles/feature';
import { CatalogDictionaryTab } from '@admin/catalog-attributes/feature';
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
import { useGetStaffAccountsQuery } from '@admin/users/data-access';
import { createProfileRoutes, createUsersRoutes, profilePath } from '@admin/users/feature';
import { staffRoleLabels } from '@admin/users/model';
import { wholesaleContentRoutes } from '@admin/wholesale-content/feature';
import { createMyTasksRoutes, createWorkReportRoutes, MyTasksOverview } from '@admin/work/feature';
import { useMemo } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { CustomerPicker } from '../customer-picker';
import { toShellUser } from './shell-user';

import type { SessionUser } from '@admin/core/auth';
import type { WorkAssignees } from '@admin/work/feature';
import type { WorkPerson } from '@admin/work/model';

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

/** People for «Звіт роботи» and «Для кого»: the staff list the admin manages on «Користувачі». */
function useStaffMembers(skip = false): { staff: readonly WorkPerson[]; loading: boolean } {
  const { data, isLoading } = useGetStaffAccountsQuery(undefined, { skip });
  const staff = useMemo(
    () =>
      (data ?? []).map((account) => ({
        id: account.id,
        name: account.fullName || account.email,
        roleLabel: staffRoleLabels[account.role],
      })),
    [data],
  );
  return { staff, loading: isLoading };
}

/** An administrator may give a new task to anyone on «Мої задачі»; others only to themselves. */
function useWorkAssignees(): WorkAssignees | null {
  const session = useAdminSession();
  const admin = session.status === 'authenticated' && canManageUsers(session.user);
  const { staff } = useStaffMembers(!admin);
  if (session.status !== 'authenticated' || !admin) return null;
  const selfId = session.user.id;
  return staff.some((person) => person.id === selfId) ? { people: staff, selfId } : null;
}

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
        ...myTasksRoutes,
        { element: <RequireRole allow={canManageRequisites} />, children: companyAdminRoutes },
        { element: <RequireRole allow={canManageUsers} />, children: usersRoutes },
        { element: <RequireRole allow={canManageUsers} />, children: workReportRoutes },
      ],
    },
    { path: '*', element: <Navigate replace to="/dashboard" /> },
  ]);
}
