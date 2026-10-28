import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UNAUTHENTICATED_HANDLER } from '@shared/auth';
import { LocaleNavigationService } from '@storefront/util';

/** When the cookie session ends on a cabinet page, open the login page and come back afterwards. */
export const UNAUTHENTICATED_HANDLER_PROVIDER = {
  provide: UNAUTHENTICATED_HANDLER,
  useFactory: () => {
    const router = inject(Router);
    const localeNavigation = inject(LocaleNavigationService);

    return () => {
      const returnUrl = router.url;
      if (!returnUrl.includes('/cabinet')) return;

      void router.navigate(localeNavigation.localizedSegments('login'), {
        queryParams: { returnUrl },
      });
    };
  },
};
