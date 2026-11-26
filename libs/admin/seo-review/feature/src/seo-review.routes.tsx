import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const SeoReviewPage = lazy(() => import('./pages/seo-review-page'));

export interface SeoReviewRouteOptions {
  /** Hook from the app: whether the signed-in user may edit catalog texts (Seo, Admin). */
  useCanEditCatalog: () => boolean;
}

/** Open to every staff role; managers see only articles (catalog review needs CanManageSiteCatalog). */
export function createSeoReviewRoutes({ useCanEditCatalog }: SeoReviewRouteOptions): RouteObject[] {
  function SeoReviewRoute() {
    return <SeoReviewPage canEditCatalog={useCanEditCatalog()} />;
  }

  return [{ path: 'seo-review', element: <SeoReviewRoute /> }];
}
