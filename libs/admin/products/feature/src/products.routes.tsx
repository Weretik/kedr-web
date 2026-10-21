import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const ProductsPage = lazy(() => import('./pages/products-page'));
const ProductDetailsPage = lazy(() => import('./pages/product-details-page'));

export type AddProductResult = 'saved' | 'volatile' | 'rejected';
export function createProductsRoutes({ onAddProduct }: { onAddProduct: (productId: number) => AddProductResult }): RouteObject[] {
  return [
    { path: 'catalog', element: <ProductsPage onAddProduct={onAddProduct} /> },
    { path: 'catalog/:productSlug', element: <ProductDetailsPage onAddProduct={onAddProduct} /> },
  ];
}
