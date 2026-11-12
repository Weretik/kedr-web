interface SeoSettingsApiError {
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

/** Turns an error of a save into one Ukrainian sentence; the local rules normally catch field errors first. */
export function seoSettingsErrorMessage(error: unknown): string {
  const apiError = (
    typeof error === 'object' && error !== null ? error : {}
  ) as SeoSettingsApiError;
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'Validation') {
    const fields = Object.keys(apiError.fieldErrors ?? {}).map((field) => field.toLowerCase());
    if (fields.includes('shareimagemediafileid'))
      return 'Цього фото вже немає в медіатеці. Виберіть інше.';
    return 'Сервер не прийняв значення. Перевірте коди.';
  }
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
