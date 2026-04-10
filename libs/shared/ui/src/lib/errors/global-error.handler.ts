import { isPlatformBrowser } from '@angular/common';
import { ErrorHandler, Injectable, inject, PLATFORM_ID } from '@angular/core';
import { AppLogger } from '@shared/logging';
import { ApiError, mapToApiError } from '@shared/util';

import { NotificationService } from '../services/notification.service';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  private readonly chunkRecoveryAttemptedKey = 'app.chunk-recovery-attempted';
  private readonly notify = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly logger = inject(AppLogger);

  handleError(error: unknown): void {
    this.logger.logClientError(error);

    if (this.isIgnorableRuntimeError(error)) {
      console.warn('Ignored non-actionable runtime error:', error);
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      const errorStr = (
        (error as { message?: string })?.message ||
        error?.toString() ||
        ''
      ).toLowerCase();
      const errorName = (error as { name?: string } | null)?.name ?? '';
      const isChunkError =
        errorName === 'ChunkLoadError' ||
        errorStr.includes('loading chunk') ||
        errorStr.includes('failed to load module script') ||
        errorStr.includes('failed to fetch dynamically imported module');

      if (isChunkError) {
        void this.recoverFromChunkLoadingError(error);
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

  private isIgnorableRuntimeError(error: unknown): boolean {
    const toText = (value: unknown): string =>
      typeof value === 'string'
        ? value
        : value instanceof Error
          ? value.message
          : value != null
            ? String(value)
            : '';

    const candidateTexts = [
      toText(error),
      toText((error as { message?: unknown } | null)?.message),
      toText((error as { reason?: unknown } | null)?.reason),
      toText((error as { rejection?: unknown } | null)?.rejection),
    ]
      .join(' ')
      .toLowerCase();

    return (
      candidateTexts.includes('script error') ||
      candidateTexts.includes('resizeobserver loop limit exceeded') ||
      candidateTexts.includes('non-error promise rejection captured')
    );
  }

  private async recoverFromChunkLoadingError(error: unknown): Promise<void> {
    const attempted =
      window.sessionStorage.getItem(this.chunkRecoveryAttemptedKey) === '1';
    if (attempted) {
      console.warn(
        'Chunk loading error detected after recovery attempt. Skipping reload.',
        error,
      );
      return;
    }

    window.sessionStorage.setItem(this.chunkRecoveryAttemptedKey, '1');
    console.warn(
      'Chunk loading error detected. Clearing caches and reloading page...',
      error,
    );

    try {
      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((name) => window.caches.delete(name)));
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );
      }
    } finally {
      window.location.reload();
    }
  }
}
