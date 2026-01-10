import { Route } from '@angular/router';
import { contactsRoutes } from '@storefront/feature/contacts';
import { homeRoutes } from '@storefront/feature/home';

export const appRoutes: Route[] = [...homeRoutes, ...contactsRoutes];
