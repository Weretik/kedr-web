import { lazy } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import { legacySiteShowcasePath } from './model/site-showcase-url-state';

import type { SiteDictionaryTabProps } from './pages/site-showcase-page';
import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

const SiteShowcasePage = lazy(() => import('./pages/site-showcase-page'));

export interface SiteModelsRouteOptions {
  /** Hook from the app: whether the signed-in user may change the attributes dictionary (Admin). */
  useCanEditCatalog: () => boolean;
  /** The «Ознаки», «Не розшифровані коди», and «Фільтри категорій» tabs, from the attributes feature. */
  renderDictionaryTab: (props: SiteDictionaryTabProps) => ReactNode;
}

/** Old «Моделі», model card, and «Ознаки» addresses open the matching place of «Вітрина сайту». */
function LegacyRedirect({ page }: { page: 'models' | 'model' | 'attributes' }) {
  const location = useLocation();
  const { id } = useParams();
  return (
    <Navigate replace to={legacySiteShowcasePath(page, new URLSearchParams(location.search), id)} />
  );
}

/** «Вітрина сайту» with its tabs (spec catalog/007 stage 4c); Managers and Admins. */
export function createSiteModelsRoutes({
  renderDictionaryTab,
  useCanEditCatalog,
}: SiteModelsRouteOptions): RouteObject[] {
  function SiteShowcaseRoute() {
    return (
      <SiteShowcasePage
        canEditCatalog={useCanEditCatalog()}
        renderDictionaryTab={renderDictionaryTab}
      />
    );
  }

  return [
    { path: 'site-showcase', element: <SiteShowcaseRoute /> },
    { path: 'site-models', element: <LegacyRedirect page="models" /> },
    { path: 'site-models/:id', element: <LegacyRedirect page="model" /> },
    { path: 'catalog-attributes', element: <LegacyRedirect page="attributes" /> },
  ];
}
