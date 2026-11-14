import type { ApiError } from '@admin/shared/api-client';

export const siteRefreshedMessage = 'Сайт оновлено: відвідувачі вже бачать зміни.';

/** The backend answers 503 while the site is not connected and 502 when the site did not answer. */
export function siteRefreshErrorMessage(error: unknown): string {
  const status = (error as Partial<ApiError> | undefined)?.status;
  if (status === 503)
    return 'Сайт ще не підключено до оновлення: зміни з’являться протягом 10 хвилин.';
  if (status === 502)
    return 'Сайт не відповів. Зміни з’являться протягом 10 хвилин, або спробуйте пізніше.';
  return 'Не вдалося оновити сайт. Спробуйте ще раз.';
}
