interface HomeContentApiError {
  code?: string;
  status?: number;
}

/** What failed, so a validation error is worded for that action. */
export type HomeContentAction = 'saveFaq' | 'saveBrand' | 'remove' | 'reorder';

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as HomeContentApiError;

/** Turns an error of a home content request into one Ukrainian sentence for the page. */
export function homeContentErrorMessage(error: unknown, action: HomeContentAction): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound') return 'Запис не знайдено: можливо, його вже видалено.';
  if (apiError.status === 409)
    return 'Список щойно змінив інший користувач. Оновіть сторінку й повторіть.';
  if (apiError.code === 'Validation')
    return action === 'saveBrand'
      ? 'Логотипа вже немає в медіатеці або назва задовга. Виберіть логотип ще раз.'
      : 'Сервер не прийняв текст: заповніть обидві мови й перевірте довжину.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
