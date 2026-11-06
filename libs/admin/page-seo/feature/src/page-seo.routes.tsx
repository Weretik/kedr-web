import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const PageSeoPage = lazy(() => import('./pages/page-seo-page'));

/** Open to every staff role (Manager, Seo, and Admin), as the backend policy CanManageContent. */
export const pageSeoRoutes: RouteObject[] = [{ path: 'page-seo', element: <PageSeoPage /> }];
