interface ApiError {
  code?: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as ApiError;

/** One Ukrainian sentence for a failed change on the «Ознаки» page. */
export function catalogAttributesErrorMessage(error: unknown): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden' || apiError.status === 403)
    return 'Змінювати ознаки може лише адміністратор.';
  if (apiError.code === 'NotFound' || apiError.status === 404)
    return 'Не знайдено: оновіть сторінку.';
  if (apiError.code === 'Conflict' || apiError.status === 409)
    return 'Таке значення вже є: виберіть іншу назву.';
  const messages = Object.values(apiError.fieldErrors ?? {})
    .flat()
    .join(' ');
  if (messages.includes('Another attribute has this'))
    return 'Ознака з такою назвою вже є: виберіть іншу назву.';
  if (messages.toLowerCase().includes('swatch'))
    return 'Зразок не підходить: колір #RRGGBB або картинка з медіатеки.';
  if (apiError.status === 400 || apiError.code === 'Invalid')
    return 'Дані не підходять. Перевірте й спробуйте ще раз.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
