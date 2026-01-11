import { Route } from '@angular/router';

export const aboutUsRoutes: Route[] = [
  {
    path: 'articles',
    loadComponent: () =>
      import('./pages/articles/articles').then((m) => m.Articles),
  },
  {
    path: 'about-company',
    loadComponent: () =>
      import('./pages/about-company/about-company').then((m) => m.AboutCompany),
  },
  {
    path: 'delivery-and-payment',
    loadComponent: () =>
      import('./pages/delivery-and-payment/delivery-and-payment').then(
        (m) => m.DeliveryAndPayment,
      ),
  },
  {
    path: 'galleria',
    loadComponent: () =>
      import('./pages/galleria/galleria').then((m) => m.Galleria),
  },
  {
    path: 'returns-exchanges',
    loadComponent: () =>
      import('./pages/returns-exchanges/returns-exchanges').then(
        (m) => m.ReturnsExchanges,
      ),
  },
];
