interface WorkApiError {
  code?: string;
}

/** Turns an error of a task or report request into one Ukrainian sentence. */
export function workErrorMessage(error: unknown): string {
  const code = (typeof error === 'object' && error !== null ? (error as WorkApiError) : {}).code;
  if (code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (code === 'NotFound') return 'Задачу не знайдено: можливо, її вже видалено.';
  if (code === 'Validation') return 'Сервер не прийняв дані: перевірте поля.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
