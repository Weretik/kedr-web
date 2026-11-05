interface WholesaleApiError {
  code?: string;
}

/** Turns an error of the save request into a message for the page; field checks run before sending. */
export function wholesaleSaveErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null ? (error as WholesaleApiError).code : undefined;
  if (code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (code === 'Validation') return 'Сервер не прийняв тексти. Перевірте поля в обох мовах.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
