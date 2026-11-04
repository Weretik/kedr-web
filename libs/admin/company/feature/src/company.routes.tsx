import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const CompanyContactsPage = lazy(() => import('./pages/company-contacts-page'));
const CompanyRequisitesPage = lazy(() => import('./pages/company-requisites-page'));

/** Open to every staff role (Manager and Admin), as the backend policy CanManageContent. */
export const companyRoutes: RouteObject[] = [
  { path: 'company-contacts', element: <CompanyContactsPage /> },
];

/** Admins only, as the backend policy RequireAdminRole; the app wraps them in a role guard. */
export const companyAdminRoutes: RouteObject[] = [
  { path: 'company-requisites', element: <CompanyRequisitesPage /> },
];
