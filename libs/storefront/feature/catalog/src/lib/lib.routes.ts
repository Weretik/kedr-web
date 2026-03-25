import { Route } from '@angular/router';

const loadProductList = () =>
  import('./pages/product-list/product-list.page').then(
    (page) => page.ProductListPage,
  );

export const catalogRoutes: Route[] = [
  {
    path: '',
    loadComponent: loadProductList,
  },
  {
    path: 'catalog/products',
    loadComponent: loadProductList,
  },
  {
    path: 'catalog/:categorySlug/products',
    loadComponent: loadProductList,
  },
  {
    path: 'catalog/product/:productSlug',
    loadComponent: () =>
      import('./pages/product-page/product-page').then(
        (page) => page.ProductPage,
      ),
  },
];
