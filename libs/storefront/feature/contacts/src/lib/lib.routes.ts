import { Route } from '@angular/router';

export const contactsRoutes: Route[] = [
  {
    path: 'contacts',
    loadComponent: () =>
      import('./page/contacts-page/contacts-page').then((m) => m.ContactsPage),
  },
];
