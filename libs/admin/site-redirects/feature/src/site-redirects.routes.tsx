import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const SiteRedirectsPage = lazy(() => import('./pages/site-redirects-page'));

/** Open to every staff role (Manager, Seo, and Admin), as the backend policy CanManageContent. */
export const siteRedirectsRoutes: RouteObject[] = [
  { path: 'site-redirects', element: <SiteRedirectsPage /> },
];
