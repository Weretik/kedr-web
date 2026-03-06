import { Route } from '@angular/router';
import { aboutUsRoutes } from '@storefront/feature/about-us';
import { catalogRoutes } from '@storefront/feature/catalog';
import { checkoutRoutes } from '@storefront/feature/checkout';
import { contactsRoutes } from '@storefront/feature/contacts';
import { wholesaleRoutes } from '@storefront/feature/wholesale';

export const appRoutes: Route[] = [
  ...contactsRoutes,
  ...wholesaleRoutes,
  ...aboutUsRoutes,
  ...catalogRoutes,
  ...checkoutRoutes,
];
