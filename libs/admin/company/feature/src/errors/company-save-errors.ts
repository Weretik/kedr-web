interface CompanyApiError {
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as CompanyApiError;

/**
 * Server field errors under the fields they belong to. The backend reasons are in English, so each field
 * gets a short Ukrainian message; the local validator normally catches these first.
 */
export function serverFieldErrors<Field extends string>(
  error: unknown,
  fields: readonly Field[],
): Partial<Record<Field, string>> | undefined {
  const apiError = asApiError(error);
  if (apiError.code !== 'Validation') return undefined;
  const errors: Partial<Record<Field, string>> = {};
  for (const [key, messages] of Object.entries(apiError.fieldErrors ?? {})) {
    const field = fields.find((name) => name.toLowerCase() === key.toLowerCase());
    if (field && messages.length) errors[field] = 'Сервер не прийняв це значення. Перевірте його.';
  }
  return Object.keys(errors).length ? errors : undefined;
}

/** Turns an error of a save request into a message for the page. */
export function companySaveErrorMessage(error: unknown): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'Validation') return 'Сервер не прийняв дані. Перевірте поля.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
