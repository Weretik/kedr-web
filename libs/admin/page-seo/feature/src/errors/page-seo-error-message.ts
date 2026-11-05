interface PageSeoApiError {
  code?: string;
}

/** Turns an error of a page SEO request into one Ukrainian sentence. */
export function pageSeoErrorMessage(error: unknown): string {
  const code = (typeof error === 'object' && error !== null ? (error as PageSeoApiError) : {}).code;
  if (code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (code === 'Validation') return 'Сервер не прийняв текст: перевірте довжину полів.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
