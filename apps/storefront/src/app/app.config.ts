import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';

import { appRoutes } from './app.routes';
import { AUTH_INIT_PROVIDER } from './auth/auth-init.provider';
import { provideStorefrontHttp } from './http/http.providers';
import { TRANSLOCO_PROVIDERS } from './localization/transloco.providers';
import { provideStorefrontLogging } from './logging/logging.providers';
import { STOREFRONT_UI_PROVIDERS } from './ui/ui.providers';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    ...provideStorefrontHttp(
      environment.api.baseUrl,
      environment.enableHttpLogs,
    ),
    provideStorefrontLogging(environment),
    AUTH_INIT_PROVIDER,
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
    ),
    provideClientHydration(
      withEventReplay(),
      withIncrementalHydration(),
      withHttpTransferCacheOptions({
        includePostRequests: false,
      }),
    ),
    ...STOREFRONT_UI_PROVIDERS,
    ...TRANSLOCO_PROVIDERS,
  ],
};
