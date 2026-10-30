interface ContentApiError {
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

/** Turns an error of a content save request into a message for the form. */
export function categoryContentErrorMessage(error: unknown): string {
  const apiError = (typeof error === 'object' && error !== null ? error : {}) as ContentApiError;

  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound') return 'Категорію не знайдено: можливо, її вже видалено.';
  if (apiError.code === 'Validation') {
    const details = Object.values(apiError.fieldErrors ?? {}).flat();
    return details.length > 0
      ? `Сервер не прийняв дані: ${details.join(' ')}`
      : 'Сервер не прийняв дані. Перевірте поля.';
  }
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
