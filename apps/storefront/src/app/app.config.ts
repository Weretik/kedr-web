import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  ErrorHandler,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import {
  provideRouter,
  withInMemoryScrolling,
  withComponentInputBinding,
} from '@angular/router';
import {
  baseUrlInterceptor,
  errorInterceptor,
  loggingInterceptor,
  API_BASE_URL,
  ENABLE_HTTP_LOGS,
} from '@shared/http';
import { APP_LOGGING_CONFIG } from '@shared/logging';
import { KedrStorePreset } from '@shared/theme';
import { GlobalErrorHandler } from '@shared/ui';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { appRoutes } from './app.routes';
import { TRANSLOCO_PROVIDERS } from './localization/transloco.providers';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE_URL, useValue: environment.api.baseUrl },
    { provide: ENABLE_HTTP_LOGS, useValue: environment.enableHttpLogs },
    {
      provide: APP_LOGGING_CONFIG,
      useValue: {
        enabled: environment.logging.enabled,
        endpoint: environment.logging.endpoint,
        environment: environment.production ? 'production' : 'development',
        appName: environment.app.name,
        appVersion: environment.app.version,
        sampleRate: environment.logging.sampleRate,
      },
    },
    provideHttpClient(
      withFetch(),
      withInterceptors([
        baseUrlInterceptor,
        loggingInterceptor,
        errorInterceptor,
      ]),
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
      withComponentInputBinding(),
    ),
    provideClientHydration(
      withEventReplay(),
      withIncrementalHydration(),
      withHttpTransferCacheOptions({
        includePostRequests: false,
      }),
    ),
    MessageService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    ...TRANSLOCO_PROVIDERS,
    providePrimeNG({
      theme: {
        preset: KedrStorePreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.my-app-dark',
          cssLayer: false,
        },
      },
      ripple: true,
      inputVariant: 'filled',
      zIndex: {
        modal: 1100,
        overlay: 1000,
        menu: 1000,
        tooltip: 1100,
      },
    }),
  ],
};
