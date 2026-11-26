import { lazy } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { SiteModelPanelsProvider } from './components/panels/site-model-panels-provider';
import { legacyCatalogAttributesPath, legacySiteShowcasePath } from './model/site-legacy-paths';

import type { SiteDictionaryTabProps } from './model/site-page-tabs';
import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

const SiteModelsPage = lazy(() => import('./pages/site-models-page'));
const SiteModelPage = lazy(() => import('./pages/site-model-page'));
const SiteReviewPage = lazy(() => import('./pages/site-review-page'));
const SiteAttributesPage = lazy(() => import('./pages/site-attributes-page'));

export interface SiteModelsRouteOptions {
  /** Hook from the app: whether the signed-in user may change the attributes dictionary (Admin). */
  useCanEditCatalog: () => boolean;
  /** The «Ознаки», «Коди з 1С», and «Фільтри категорій» tabs, from the attributes feature. */
  renderDictionaryTab: (props: SiteDictionaryTabProps) => ReactNode;
  /** Hook from the app: how many 1C codes wait to be decoded, for the «Коди з 1С» tab. */
  useUnresolvedCodesCount: () => number | undefined;
}

/** An old address opens the matching new page with `to` (spec admin/site-models/001, R-010). */
function LegacyRedirect({ to }: { to: (params: URLSearchParams) => string }) {
  const location = useLocation();
  return <Navigate replace to={to(new URLSearchParams(location.search))} />;
}

/** Every site page opens the same model panels (R-011). */
function SitePagesLayout() {
  return (
    <SiteModelPanelsProvider>
      <Outlet />
    </SiteModelPanelsProvider>
  );
}

/** «Моделі», a model, «Перевірка», and «Ознаки та фільтри» (spec admin/site-models/001); Managers and Admins. */
export function createSiteModelsRoutes({
  renderDictionaryTab,
  useCanEditCatalog,
  useUnresolvedCodesCount,
}: SiteModelsRouteOptions): RouteObject[] {
  function SiteReviewRoute() {
    return (
      <SiteReviewPage
        canEditCatalog={useCanEditCatalog()}
        codesCount={useUnresolvedCodesCount()}
        renderDictionaryTab={renderDictionaryTab}
      />
    );
  }

  function SiteAttributesRoute() {
    return (
      <SiteAttributesPage
        canEditCatalog={useCanEditCatalog()}
        renderDictionaryTab={renderDictionaryTab}
      />
    );
  }

  return [
    {
      element: <SitePagesLayout />,
      children: [
        { path: 'site-models', element: <SiteModelsPage /> },
        { path: 'site-models/:id', element: <SiteModelPage /> },
        { path: 'site-review', element: <SiteReviewRoute /> },
        { path: 'site-attributes', element: <SiteAttributesRoute /> },
      ],
    },
    { path: 'site-showcase', element: <LegacyRedirect to={legacySiteShowcasePath} /> },
    { path: 'catalog-attributes', element: <LegacyRedirect to={legacyCatalogAttributesPath} /> },
  ];
}
