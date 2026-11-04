interface GalleryApiError {
  code?: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}

/** What failed, so a 409 is worded for that action. */
export type GalleryAction = 'addPhotos' | 'addVideo' | 'save' | 'remove' | 'reorder';

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as GalleryApiError;

/** Turns an error of a gallery request into one Ukrainian sentence for the page. */
export function galleryErrorMessage(error: unknown, action: GalleryAction): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound') return 'Картку не знайдено: можливо, її вже прибрано.';
  if (apiError.status === 409)
    return action === 'addVideo'
      ? 'Це відео вже є в галереї.'
      : 'Галерею щойно змінив інший користувач. Оновіть сторінку й повторіть.';
  if (apiError.code === 'Validation') {
    if (action === 'addPhotos') return 'Деяких фото вже немає в медіатеці. Оновіть вибір.';
    if (action === 'addVideo') return 'Це не посилання на відео YouTube.';
    return 'Сервер не прийняв текст: перевірте довжину назви та підпису.';
  }
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
