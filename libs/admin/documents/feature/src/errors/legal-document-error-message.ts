interface DocumentApiError {
  code?: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as DocumentApiError;

/** Turns an error of a document request into a message for the page. */
export function legalDocumentErrorMessage(error: unknown): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound') return 'Редакцію не знайдено: можливо, її вже видалено.';
  if (apiError.status === 409)
    return 'Документ щойно змінив інший користувач. Оновіть сторінку й повторіть.';
  if (apiError.code === 'Validation') {
    if (
      Object.keys(apiError.fieldErrors ?? {}).some((key) => key.toLowerCase() === 'effectivefrom')
    )
      return 'Дата редакції раніша за чинну. Вкажіть пізнішу.';
    return 'Сервер не прийняв текст. Перевірте обидві мови.';
  }
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
