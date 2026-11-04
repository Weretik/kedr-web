import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const CompanyContactsPage = lazy(() => import('./pages/company-contacts-page'));

/** Open to every staff role (Manager and Admin), as the backend policy CanManageContent. */
export const companyRoutes: RouteObject[] = [
  { path: 'company-contacts', element: <CompanyContactsPage /> },
];
