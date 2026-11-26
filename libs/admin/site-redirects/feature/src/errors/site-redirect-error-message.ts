import type { ApiError } from '@admin/shared/api-client';

const asApiError = (error: unknown): Partial<ApiError> =>
  typeof error === 'object' && error !== null ? (error as Partial<ApiError>) : {};

/**
 * One Ukrainian sentence for a failed redirect request. The server words its refusals in Ukrainian (duplicate,
 * chain, reserved address, changed meanwhile), so they are shown as they are.
 */
export function siteRedirectErrorMessage(
  error: unknown,
  fallback = 'Не вдалося зберегти. Спробуйте ще раз.',
): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound') return 'Цієї переадресації вже немає. Оновіть список.';
  const fields = Object.values(apiError.fieldErrors ?? {}).flat();
  if (fields.length > 0) return fields.join(' ');
  if (apiError.status === 409 || apiError.code === 'Validation')
    return apiError.message?.trim() || fallback;
  return fallback;
}
