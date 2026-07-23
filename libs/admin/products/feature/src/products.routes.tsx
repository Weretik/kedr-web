import { ProductsPage } from './pages/products-page';

import type { RouteObject } from 'react-router-dom';

export const productsRoutes: RouteObject[] = [{ path: 'catalog', element: <ProductsPage /> }];
