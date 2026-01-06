import { Route } from '@angular/router';

export const homeRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./page/home-page/home-page').then((m) => m.HomePage),
  },
];
