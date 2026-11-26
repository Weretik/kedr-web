import { lazy } from 'react';

import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

const ProductsPage = lazy(() => import('./pages/products-page'));
const ProductDetailsPage = lazy(() => import('./pages/product-details-page'));

export type AddProductResult = 'saved' | 'volatile' | 'rejected';
export interface ProductsRouteOptions {
  onAddProduct: (productId: number) => AddProductResult;
  /** Hook from the app: whether the signed-in user may change addresses and see deleted products. */
  useCanEditCatalog?: () => boolean;
  /** The product's site model block from the site models feature («Модель на сайті»). */
  renderSiteModel?: (productId: number) => ReactNode;
  /** Header actions of «Каталог товарів» from other features («Завантажити роздрібні ціни»). */
  listActions?: ReactNode;
}

export function createProductsRoutes({
  onAddProduct,
  useCanEditCatalog = () => false,
  renderSiteModel,
  listActions,
}: ProductsRouteOptions): RouteObject[] {
  function ProductsRoute() {
    const canEdit = useCanEditCatalog();
    return (
      <ProductsPage
        canEditSlug={canEdit}
        canSeeDeleted={canEdit}
        listActions={listActions}
        onAddProduct={onAddProduct}
      />
    );
  }

  function ProductDetailsRoute() {
    return (
      <ProductDetailsPage
        canEditSlug={useCanEditCatalog()}
        onAddProduct={onAddProduct}
        renderSiteModel={renderSiteModel}
      />
    );
  }

  return [
    { path: 'catalog', element: <ProductsRoute /> },
    { path: 'catalog/:productSlug', element: <ProductDetailsRoute /> },
  ];
}
