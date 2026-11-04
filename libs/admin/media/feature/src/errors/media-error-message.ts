interface MediaApiError {
  code?: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}

/** What failed, so a `409` and field errors are worded for that action. */
export type MediaAction =
  'upload' | 'replace' | 'saveFile' | 'move' | 'deleteFile' | 'saveFolder' | 'deleteFolder';

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as MediaApiError;

const fieldReason = (error: MediaApiError) =>
  Object.values(error.fieldErrors ?? {})
    .flat()
    .join(' ');

/** Turns an error of a media request into one Ukrainian sentence for the page. */
export function mediaErrorMessage(error: unknown, action: MediaAction): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound') return 'Файл або папку не знайдено: можливо, їх уже видалено.';
  if (apiError.status === 503)
    return 'Сховище фото не налаштоване на сервері. Зверніться до адміністратора.';
  if (apiError.status === 413) return 'Файл більший за 15 МБ.';
  if (apiError.status === 409)
    return action === 'deleteFolder'
      ? 'Папка не порожня: спершу перемістіть або видаліть її файли й підпапки.'
      : 'Папка з такою назвою тут уже є. Вкажіть іншу назву.';
  if (apiError.code === 'Validation') {
    const reason = fieldReason(apiError);
    if (/15 MB/.test(reason)) return 'Файл більший за 15 МБ.';
    if (/JPEG, PNG, or WebP/.test(reason)) return 'Підходять лише фото JPEG, PNG або WebP.';
    if (/moved into itself|subfolder/.test(reason))
      return 'Папку не можна перемістити саму в себе або у її підпапку.';
    if (/does not exist/.test(reason)) return 'Вибраної папки вже немає. Оновіть сторінку.';
    return 'Сервер не прийняв дані. Перевірте поля.';
  }
  if (apiError.code === 'Network' || apiError.code === 'Timeout')
    return 'Немає зв’язку з сервером. Перевірте інтернет і спробуйте ще раз.';
  return action === 'upload' || action === 'replace'
    ? 'Не вдалося завантажити файл. Спробуйте ще раз.'
    : 'Не вдалося зберегти. Спробуйте ще раз.';
}
