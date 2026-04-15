import { inject } from '@angular/core';
import { RedirectFunction, Route } from '@angular/router';
import { aboutUsRoutes } from '@storefront/feature/about-us';
import { storefrontFeatureArticlesRoutes } from '@storefront/feature/articles';
import { catalogRoutes } from '@storefront/feature/catalog';
import { categoriesRoutes } from '@storefront/feature/categories';
import { checkoutRoutes } from '@storefront/feature/checkout';
import { contactsRoutes } from '@storefront/feature/contacts';
import { notFoundRoutes } from '@storefront/feature/not-found';
import { regionsRoutes } from '@storefront/feature/regions';
import { wholesaleRoutes } from '@storefront/feature/wholesale';
import { LocaleNavigationService } from '@storefront/util';

const redirectToLocalizedNotFound: RedirectFunction = () => {
  const localeNavigation = inject(LocaleNavigationService);
  return `/${localeNavigation.getCurrentLocale()}/404`;
};

const localizedRoutes: Route[] = [
  ...contactsRoutes,
  ...categoriesRoutes,
  ...wholesaleRoutes,
  ...aboutUsRoutes,
  ...catalogRoutes,
  ...checkoutRoutes,
  ...regionsRoutes,
  ...storefrontFeatureArticlesRoutes,
  ...notFoundRoutes,
  {
    path: '**',
    redirectTo: '404',
  },
];

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'uk',
  },
  {
    path: 'uk',
    children: localizedRoutes,
  },
  {
    path: 'ru',
    children: localizedRoutes,
  },
  {
    path: '**',
    redirectTo: redirectToLocalizedNotFound,
  },
];
