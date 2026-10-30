import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const ProductsPage = lazy(() => import('./pages/products-page'));
const ProductDetailsPage = lazy(() => import('./pages/product-details-page'));

export type AddProductResult = 'saved' | 'volatile' | 'rejected';
export interface ProductsRouteOptions {
  onAddProduct: (productId: number) => AddProductResult;
  /** Hook from the app: whether the signed-in user may change addresses and see deleted products. */
  useCanEditCatalog?: () => boolean;
}

export function createProductsRoutes({
  onAddProduct,
  useCanEditCatalog = () => false,
}: ProductsRouteOptions): RouteObject[] {
  function ProductsRoute() {
    return <ProductsPage canSeeDeleted={useCanEditCatalog()} onAddProduct={onAddProduct} />;
  }

  function ProductDetailsRoute() {
    return <ProductDetailsPage canEditSlug={useCanEditCatalog()} onAddProduct={onAddProduct} />;
  }

  return [
    { path: 'catalog', element: <ProductsRoute /> },
    { path: 'catalog/:productSlug', element: <ProductDetailsRoute /> },
  ];
}
