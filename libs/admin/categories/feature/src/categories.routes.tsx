import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const CategoriesPage = lazy(() => import('./pages/categories-page'));
const CategoryDetailsPage = lazy(() => import('./pages/category-details-page'));

export interface CategoriesRouteOptions {
  /** Hook from the app: whether the signed-in user may edit addresses and texts and see deleted rows. */
  useCanEditCatalog: () => boolean;
}

export function createCategoriesRoutes({
  useCanEditCatalog,
}: CategoriesRouteOptions): RouteObject[] {
  function CategoriesRoute() {
    return <CategoriesPage canSeeDeleted={useCanEditCatalog()} />;
  }

  function CategoryDetailsRoute() {
    return <CategoryDetailsPage canEdit={useCanEditCatalog()} />;
  }

  return [
    { path: 'categories', element: <CategoriesRoute /> },
    { path: 'categories/:categoryId', element: <CategoryDetailsRoute /> },
  ];
}
