interface ApiError {
  code?: string;
  status?: number;
}

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as ApiError;

/** One Ukrainian sentence for a failed save or upload of product media. */
export function productMediaErrorMessage(error: unknown, action: 'save' | 'upload'): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden' || apiError.status === 403)
    return 'Недостатньо прав для цієї дії.';
  if (apiError.status === 503)
    return 'Сховище фото не налаштоване на сервері. Зверніться до адміністратора.';
  if (apiError.status === 413) return 'Файл більший за 15 МБ.';
  if (action === 'save' && (apiError.code === 'Invalid' || apiError.status === 400))
    return 'Деякі файли вже видалено з «Медіа». Оновіть сторінку й виберіть інші.';
  return action === 'upload'
    ? 'Не вдалося завантажити файл. Спробуйте ще раз.'
    : 'Не вдалося зберегти фото товару. Спробуйте ще раз.';
}
