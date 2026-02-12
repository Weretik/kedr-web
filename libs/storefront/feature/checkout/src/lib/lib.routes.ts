import { Route } from '@angular/router';

export const checkoutRoutes: Route[] = [
  {
    path: 'checkout',
    loadComponent: () =>
      import('./page/checkout-page').then((m) => m.CheckoutPage),
  },
];
