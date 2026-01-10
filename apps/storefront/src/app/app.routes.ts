import { Route } from '@angular/router';
import { contactsRoutes } from '@storefront/feature/contacts';
import { homeRoutes } from '@storefront/feature/home';
import { wholesaleRoutes } from '@storefront/feature/wholesale';

export const appRoutes: Route[] = [
  ...homeRoutes,
  ...contactsRoutes,
  ...wholesaleRoutes,
];
