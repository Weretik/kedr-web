import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SessionStore } from '@shared/auth';
import { LocaleNavigationService } from '@storefront/util';

export const cabinetAuthGuard: CanMatchFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);
  const localeNavigation = inject(LocaleNavigationService);

  if (session.isAuthenticated()) return true;

  return router.createUrlTree(localeNavigation.localizedSegments('login'), {
    queryParams: { returnUrl: router.url },
  });
};
