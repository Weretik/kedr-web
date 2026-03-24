import { Route } from '@angular/router';
import { aboutUsRoutes } from '@storefront/feature/about-us';
import { storefrontFeatureArticlesRoutes } from '@storefront/feature/articles';
import { catalogRoutes } from '@storefront/feature/catalog';
import { checkoutRoutes } from '@storefront/feature/checkout';
import { contactsRoutes } from '@storefront/feature/contacts';
import { regionsRoutes } from '@storefront/feature/regions';
import { wholesaleRoutes } from '@storefront/feature/wholesale';

export const appRoutes: Route[] = [
  ...contactsRoutes,
  ...wholesaleRoutes,
  ...aboutUsRoutes,
  ...catalogRoutes,
  ...checkoutRoutes,
  ...regionsRoutes,
  ...storefrontFeatureArticlesRoutes,
];
