interface ApiError {
  code?: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as ApiError;

/** One Ukrainian sentence for a failed change in the product «Властивості», «Група», or «Перевірка». */
export function productAttributesErrorMessage(error: unknown): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden' || apiError.status === 403)
    return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound' || apiError.status === 404)
    return 'Товар або групу не знайдено: оновіть сторінку.';
  const messages = Object.values(apiError.fieldErrors ?? {})
    .flat()
    .join(' ');
  if (messages.includes('another category')) return 'Група з іншої категорії.';
  if (messages.includes('not in this attribute')) return 'Значення не з цієї властивості.';
  if (messages.includes('on the site') || messages.includes('not on the site'))
    return 'Головним може бути лише товар, який є на сайті.';
  if (messages.includes('no recognized attributes'))
    return 'Для товару ще немає розпізнаних властивостей.';
  if (apiError.status === 400 || apiError.code === 'Invalid')
    return 'Дані не підходять. Перевірте й спробуйте ще раз.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
