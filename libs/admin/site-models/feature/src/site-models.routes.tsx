import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const SiteShowcasePage = lazy(() => import('./pages/site-showcase-page'));
const SiteModelsPage = lazy(() => import('./pages/site-models-page'));
const SiteModelPage = lazy(() => import('./pages/site-model-page'));

/** «Вітрина сайту», «Моделі», and the model card (spec catalog/007); Managers and Admins. */
export function createSiteModelsRoutes(): RouteObject[] {
  return [
    { path: 'site-showcase', element: <SiteShowcasePage /> },
    { path: 'site-models', element: <SiteModelsPage /> },
    { path: 'site-models/:id', element: <SiteModelPage /> },
  ];
}
