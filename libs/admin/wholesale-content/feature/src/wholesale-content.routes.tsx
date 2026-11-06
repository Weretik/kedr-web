import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const WholesaleContentPage = lazy(() => import('./pages/wholesale-content-page'));

/** Open to every staff role (Manager, Seo, and Admin), as the backend policy CanManageContent. */
export const wholesaleContentRoutes: RouteObject[] = [
  { path: 'wholesale-content', element: <WholesaleContentPage /> },
];
