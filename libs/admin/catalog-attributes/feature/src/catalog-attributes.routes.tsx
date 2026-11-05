import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const CatalogAttributesPage = lazy(() => import('./pages/catalog-attributes-page'));

export interface CatalogAttributesRouteOptions {
  /** Hook from the app: whether the signed-in user may change the dictionary (Admin). */
  useCanEditCatalog: () => boolean;
}

export function createCatalogAttributesRoutes({
  useCanEditCatalog,
}: CatalogAttributesRouteOptions): RouteObject[] {
  function CatalogAttributesRoute() {
    return <CatalogAttributesPage canEdit={useCanEditCatalog()} />;
  }

  return [{ path: 'catalog-attributes', element: <CatalogAttributesRoute /> }];
}
