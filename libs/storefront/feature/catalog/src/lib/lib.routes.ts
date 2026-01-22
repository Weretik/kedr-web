import { Route } from '@angular/router';

export const catalogRoutes: Route[] = [
  {
    path: 'catalog/products',
    loadComponent: () =>
      import('./pages/product-list-page/product-list-page').then(
        (m) => m.ProductListPage,
      ),
  },
  {
    path: 'catalog/:categorySlug/products',
    loadComponent: () =>
      import('./pages/product-list-page/product-list-page').then(
        (m) => m.ProductListPage,
      ),
  },
];
