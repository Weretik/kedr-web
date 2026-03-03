import { isPlatformBrowser } from '@angular/common';
import { ErrorHandler, Injectable, inject, PLATFORM_ID } from '@angular/core';
import { ApiError, mapToApiError } from '@shared/util';

import { NotificationService } from '../services/notification.service';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  private readonly notify = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);

  handleError(error: unknown): void {
    if (isPlatformBrowser(this.platformId)) {
      const errorStr = (
        (error as { message?: string })?.message ||
        error?.toString() ||
        ''
      ).toLowerCase();
      const isChunkError =
        errorStr.includes('loading chunk') ||
        errorStr.includes('failed to load module script') ||
        errorStr.includes('failed to fetch dynamically imported module');

      if (isChunkError) {
        console.warn('Chunk loading error detected. Reloading page...', error);
        window.location.reload();
        return;
      }
    }

    const apiError: ApiError = mapToApiError(error);
    if (this.isApiError(error)) {
      this.notify.error(error.message);
      return;
    }

    console.error(error);
    this.notify.error('Помилка', apiError.message);
  }

  private isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    );
  }
}
