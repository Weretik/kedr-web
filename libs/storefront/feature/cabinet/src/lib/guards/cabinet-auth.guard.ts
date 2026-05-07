import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { SessionStore } from '@shared/auth';
import { LocaleNavigationService } from '@storefront/util';

export const cabinetAuthGuard: CanMatchFn = (
  _route,
  segments: UrlSegment[],
) => {
  const session = inject(SessionStore);
  const router = inject(Router);
  const localeNavigation = inject(LocaleNavigationService);

  if (session.isAuthenticated()) return true;

  const locale = localeNavigation.getCurrentLocale();
  const targetPath = segments.map((segment) => segment.path).join('/');
  const returnUrl = targetPath
    ? `/${locale}/${targetPath}`
    : `/${locale}/cabinet`;

  return router.createUrlTree(localeNavigation.localizedSegments('login'), {
    queryParams: { returnUrl },
  });
};
