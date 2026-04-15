import { Route } from '@angular/router';

export const categoriesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./page/categories').then((page) => page.Categories),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./page/categories').then((page) => page.Categories),
  },
];
