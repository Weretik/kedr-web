import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const ProductsPage = lazy(() => import('./pages/products-page'));

export const productsRoutes: RouteObject[] = [{ path: 'catalog', element: <ProductsPage /> }];
