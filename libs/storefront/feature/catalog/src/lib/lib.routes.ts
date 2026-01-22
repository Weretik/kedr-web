import { Route } from '@angular/router';

export const catalogRoutes: Route[] = [
  {
    path: 'catalog/products',
    loadComponent: () =>
      import('./pages/product-list/product-list.page').then(
        (page) => page.ProductListPage,
      ),
  },
  {
    path: 'catalog/:categorySlug/products',
    loadComponent: () =>
      import('./pages/product-list/product-list.page').then(
        (page) => page.ProductListPage,
      ),
  },
];
