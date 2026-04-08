import { APP_INITIALIZER } from '@angular/core';
import {
  provideTransloco,
  translocoConfig,
  TranslocoService,
} from '@jsverse/transloco';
import { LocaleNavigationService, StorefrontLocale } from '@storefront/util';

import { TranslocoHttpLoader } from './transloco.loader';
import { environment } from '../../environments/environment';

const SUPPORTED_LANGS: StorefrontLocale[] = ['uk', 'ru'];

function initializeTransloco(
  translocoService: TranslocoService,
  localeNavigation: LocaleNavigationService,
): () => void {
  return () => {
    const locale = localeNavigation.getCurrentLocale();
    translocoService.setActiveLang(locale);
  };
}

export const TRANSLOCO_PROVIDERS = [
  provideTransloco({
    config: translocoConfig({
      availableLangs: SUPPORTED_LANGS,
      defaultLang: 'uk',
      fallbackLang: 'uk',
      reRenderOnLangChange: true,
      prodMode: environment.production,
    }),
    loader: TranslocoHttpLoader,
  }),
  {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [TranslocoService, LocaleNavigationService],
    useFactory: initializeTransloco,
  },
];
