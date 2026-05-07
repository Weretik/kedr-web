import { ErrorHandler } from '@angular/core';
import { KedrStorePreset } from '@shared/theme';
import { GlobalErrorHandler } from '@shared/ui';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

export const STOREFRONT_UI_PROVIDERS = [
  MessageService,
  { provide: ErrorHandler, useClass: GlobalErrorHandler },
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
];
