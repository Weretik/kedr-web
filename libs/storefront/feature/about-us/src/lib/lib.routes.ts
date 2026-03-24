import { Route } from '@angular/router';

export const aboutUsRoutes: Route[] = [
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
  {
    path: 'requisites',
    loadComponent: () =>
      import('./pages/requisites/requisites').then((page) => page.Requisites),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy').then(
        (page) => page.PrivacyPolicy,
      ),
  },
  {
    path: 'public-offer',
    loadComponent: () =>
      import('./pages/public-offer/public-offer').then(
        (page) => page.PublicOffer,
      ),
  },
];
