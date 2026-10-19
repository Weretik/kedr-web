import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const ProductsPage = lazy(() => import('./pages/products-page'));
const ProductDetailsPage = lazy(() => import('./pages/product-details-page'));

export const productsRoutes: RouteObject[] = [
  { path: 'catalog', element: <ProductsPage /> },
  { path: 'catalog/:productSlug', element: <ProductDetailsPage /> },
];
