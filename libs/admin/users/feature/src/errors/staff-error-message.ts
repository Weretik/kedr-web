import type { ApiError } from '@admin/shared/api-client';

const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' && error !== null && 'code' in error && 'message' in error;

/** Server photo-limit messages (English, stable) in the words the page uses. */
const photoMessages: Record<string, string> = {
  'The photo is larger than 2 MB.': 'Фото завелике. Максимум — 2 МБ.',
  'Only JPEG, PNG and WebP photos are supported.':
    'Підходять лише фото у форматі JPG, PNG або WebP.',
  'The photo must be at least 128×128 pixels.':
    'Фото замале. Потрібно щонайменше 128×128 пікселів.',
  'The photo resolution is too high (more than 24 megapixels).':
    'Фото має завелику роздільну здатність (понад 24 мегапікселі).',
};

const validationMessage = (fieldErrors: Record<string, string[]>): string => {
  if (fieldErrors['currentPassword']) {
    return 'Невірний поточний пароль.';
  }

  const photoError = fieldErrors['file']?.[0];
  if (photoError) {
    return photoMessages[photoError] ?? 'Це фото не підходить. Спробуйте інше.';
  }

  const details = Object.values(fieldErrors).flat();
  return details.length > 0 ? `Перевірте дані: ${details.join(' ')}` : 'Перевірте введені дані.';
};

/** Turns an RTK Query error from the users or profile API into a message for the dialog. */
export const getStaffErrorMessage = (error: unknown): string => {
  if (!isApiError(error)) {
    return 'Не вдалося виконати дію. Спробуйте ще раз.';
  }

  if (error.status === 409) {
    return 'Користувач з таким email вже існує.';
  }

  if (error.status === 413) {
    return 'Фото завелике. Максимум — 2 МБ.';
  }

  if (error.status === 503) {
    return 'Сховище фото зараз недоступне. Спробуйте пізніше або зверніться до адміністратора.';
  }

  if (error.code === 'Forbidden') {
    return 'Недостатньо прав для цієї дії.';
  }

  if (error.code === 'NotFound') {
    return 'Користувача не знайдено. Оновіть сторінку.';
  }

  if (error.code === 'Validation') {
    return validationMessage(error.fieldErrors ?? {});
  }

  if (error.code === 'Network' || error.code === 'Timeout') {
    return 'Сервер недоступний. Перевірте зʼєднання та спробуйте ще раз.';
  }

  return 'Не вдалося виконати дію. Спробуйте ще раз.';
};
