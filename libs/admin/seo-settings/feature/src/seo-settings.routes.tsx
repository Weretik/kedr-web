import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const SeoSettingsPage = lazy(() => import('./pages/seo-settings-page'));

/** Open to every staff role (Manager, Seo, and Admin), as the backend policy CanManageContent. */
export const seoSettingsRoutes: RouteObject[] = [
  { path: 'seo-settings', element: <SeoSettingsPage /> },
];
