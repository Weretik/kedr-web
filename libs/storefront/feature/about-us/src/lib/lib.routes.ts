import { Route } from '@angular/router';

export const aboutUsRoutes: Route[] = [
  {
    path: 'articles',
    loadComponent: () =>
      import('./pages/articles/articles').then((page) => page.Articles),
  },
  {
    path: 'about-company',
    loadComponent: () =>
      import('./pages/about-company/about-company').then(
        (page) => page.AboutCompany,
      ),
  },
  {
    path: 'delivery-and-payment',
    loadComponent: () =>
      import('./pages/delivery-and-payment/delivery-and-payment').then(
        (page) => page.DeliveryAndPayment,
      ),
  },
  {
    path: 'galleria',
    loadComponent: () =>
      import('./pages/galleria/galleria').then((page) => page.Galleria),
  },
  {
    path: 'returns-exchanges',
    loadComponent: () =>
      import('./pages/returns-exchanges/returns-exchanges').then(
        (page) => page.ReturnsExchanges,
      ),
  },
];
