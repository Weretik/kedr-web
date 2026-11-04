import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const HomeContentPage = lazy(() => import('./pages/home-content-page'));

/** Open to every staff role (Manager and Admin), as the backend policy CanManageContent. */
export const homeContentRoutes: RouteObject[] = [
  { path: 'home-content', element: <HomeContentPage /> },
];
