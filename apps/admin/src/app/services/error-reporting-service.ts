import { toApiError } from '@admin/shared/api-client';
import { appConfig } from '@admin/shared/config';

import { showErrorNotification } from './notification-service';

const isCriticalApiError = (error: ReturnType<typeof toApiError>) =>
  error.code === 'Network' || error.code === 'Timeout' || error.code === 'Server';

export const reportCriticalError = (error: unknown, componentStack?: string) => {
  if (!appConfig.isDevelopment) {
    return;
  }

  console.error('[Admin application error]', error, componentStack);
  showErrorNotification({
    message: 'Произошла критическая ошибка. Обновите страницу и повторите действие.',
  });
};

export const reportApiError = (error: unknown) => {
  const apiError = toApiError(error);

  if (!appConfig.isDevelopment || !isCriticalApiError(apiError)) {
    return;
  }

  console.error('[Admin API error]', apiError);
  showErrorNotification({
    message: apiError.message || 'Ошибка сервера. Попробуйте ещё раз.',
    traceId: apiError.traceId,
  });
};
