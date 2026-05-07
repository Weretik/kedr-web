import { inject } from '@angular/core';
import { RedirectFunction, Route } from '@angular/router';
import { aboutUsRoutes as aboutUsFeatureRoutes } from '@storefront/feature/about-us';
import { storefrontFeatureArticlesRoutes as articlesFeatureRoutes } from '@storefront/feature/articles';
import { authRoutes as authFeatureRoutes } from '@storefront/feature/auth';
import { storefrontFeatureCabinetRoutes as cabinetFeatureRoutes } from '@storefront/feature/cabinet';
import { catalogRoutes as catalogFeatureRoutes } from '@storefront/feature/catalog';
import { categoriesRoutes as categoriesFeatureRoutes } from '@storefront/feature/categories';
import { checkoutRoutes as checkoutFeatureRoutes } from '@storefront/feature/checkout';
import { contactsRoutes as contactsFeatureRoutes } from '@storefront/feature/contacts';
import { notFoundRoutes as notFoundFeatureRoutes } from '@storefront/feature/not-found';
import { regionsRoutes as regionsFeatureRoutes } from '@storefront/feature/regions';
import { wholesaleRoutes as wholesaleFeatureRoutes } from '@storefront/feature/wholesale';
import { LocaleNavigationService } from '@storefront/util';

const redirectToLocalizedNotFound: RedirectFunction = () => {
  const localeNavigation = inject(LocaleNavigationService);
  return `/${localeNavigation.getCurrentLocale()}/404`;
};

const localizedRoutes: Route[] = [
  ...contactsFeatureRoutes,
  ...categoriesFeatureRoutes,
  ...wholesaleFeatureRoutes,
  ...aboutUsFeatureRoutes,
  ...catalogFeatureRoutes,
  ...checkoutFeatureRoutes,
  ...regionsFeatureRoutes,
  ...authFeatureRoutes,
  ...cabinetFeatureRoutes,
  ...articlesFeatureRoutes,
  ...notFoundFeatureRoutes,
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
