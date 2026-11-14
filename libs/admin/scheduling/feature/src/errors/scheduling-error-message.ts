interface SchedulingApiError {
  code?: string;
  status?: number;
  message?: string;
}

/**
 * One Ukrainian sentence for a failed request. A rejected schedule (400) and a refused run (409:
 * «Задача вже виконується», «Запуск уже заплановано») keep the backend's own reason.
 */
export function schedulingErrorMessage(error: unknown, fallback: string): string {
  const apiError = (typeof error === 'object' && error !== null ? error : {}) as SchedulingApiError;
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound') return 'Задачу не знайдено.';
  if ((apiError.status === 400 || apiError.status === 409) && apiError.message)
    return apiError.message;
  return fallback;
}
