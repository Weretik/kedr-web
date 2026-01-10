import { Route } from '@angular/router';

export const wholesaleRoutes: Route[] = [
  {
    path: 'wholesale',
    loadComponent: () =>
      import('./wholesale/page/wholesale-page').then((m) => m.WholesalePage),
  },
];
