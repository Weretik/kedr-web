import { Route } from '@angular/router';

export const authRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
];
