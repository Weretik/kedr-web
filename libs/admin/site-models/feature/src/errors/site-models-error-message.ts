interface ApiError {
  code?: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as ApiError;

/** One Ukrainian sentence for a failed change of a model, its products, or a product's attributes. */
export function siteModelsErrorMessage(error: unknown): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden' || apiError.status === 403)
    return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound' || apiError.status === 404)
    return 'Модель або товар не знайдено: оновіть сторінку.';
  const messages = Object.values(apiError.fieldErrors ?? {})
    .flat()
    .join(' ');
  if (messages.includes('already in another model'))
    return 'Товар уже в іншій прийнятій моделі: спершу приберіть його звідти.';
  if (messages.includes("model's category")) return 'Товар не з категорії цієї моделі.';
  if (messages.includes('final category'))
    return 'Модель створюється лише в кінцевій категорії (без підкатегорій).';
  if (messages.includes('not in this attribute')) return 'Значення не з цієї ознаки.';
  if (messages.includes('numeric')) return 'Числову ознаку не можна зробити перемикачем.';
  if (messages.includes('no recognized attributes'))
    return 'Для товару ще немає розпізнаних ознак.';
  if (apiError.status === 400 || apiError.code === 'Invalid')
    return 'Дані не підходять. Перевірте й спробуйте ще раз.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
