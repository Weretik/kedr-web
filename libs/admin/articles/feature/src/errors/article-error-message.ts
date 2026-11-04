interface ArticleApiError {
  code?: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as ArticleApiError;

const fieldMessages = (error: ArticleApiError, field: string) =>
  Object.entries(error.fieldErrors ?? {})
    .filter(([key]) => key.toLowerCase() === field)
    .flatMap(([, messages]) => messages);

/** A server error on the address: in practice another article already uses it. */
export function articleSlugServerError(error: unknown): string | undefined {
  const apiError = asApiError(error);
  return apiError.code === 'Validation' && fieldMessages(apiError, 'slug').length > 0
    ? 'Ця адреса вже зайнята іншою статтею. Вкажіть іншу.'
    : undefined;
}

/** Turns an error of an article request into a message for the page. */
export function articleErrorMessage(error: unknown): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound') return 'Статтю не знайдено: можливо, її вже видалено.';
  if (apiError.code === 'Validation')
    return articleSlugServerError(error) ?? 'Сервер не прийняв дані. Перевірте поля.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}

/** The backend checks the picture itself; its English reasons are shown in Ukrainian. */
export function articleCoverErrorMessage(error: unknown): string {
  const apiError = asApiError(error);
  if (apiError.status === 413) return 'Файл більший за 10 МБ.';
  const reason = fieldMessages(apiError, 'file').join(' ');
  if (/10 MB/.test(reason)) return 'Файл більший за 10 МБ.';
  if (/at least/.test(reason)) return 'Зображення має бути не вужче за 600 px.';
  if (/megapixels/.test(reason)) return 'Роздільність завелика: не більше 40 мегапікселів.';
  if (/JPEG, PNG and WebP/.test(reason)) return 'Підходять лише JPEG, PNG або WebP.';
  if (reason) return 'Не вдалося обробити зображення. Спробуйте інше.';
  return articleErrorMessage(error);
}
