/** What the profile calls can fail with, as the API client reports it. */
export interface ProfileFailure {
  code: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}

/** Server photo-limit messages (English, stable) in the app's words. */
const photoMessages: Record<string, string> = {
  'Only JPEG, PNG and WebP photos are supported.': 'Підходять лише фото JPG, PNG або WebP.',
  'The photo is larger than 2 MB.': 'Фото завелике. Максимум — 2 МБ.',
  'The photo must be at least 128×128 pixels.':
    'Фото замале. Потрібно щонайменше 128×128 пікселів.',
  'The photo resolution is too high (more than 24 megapixels).':
    'Фото має завелику роздільну здатність.',
};

/** One sentence for the cabinet; the same cases as the Admin profile dialog. */
export function profileErrorMessage(failure: ProfileFailure): string {
  if (failure.status === 409) return 'Цей e-mail уже використовується.';
  if (failure.status === 413) return 'Фото завелике. Максимум — 2 МБ.';
  if (failure.status === 503) return 'Сховище фото зараз недоступне. Спробуйте пізніше.';
  if (failure.code === 'Network' || failure.code === 'Timeout') {
    return 'Немає звʼязку з сервером. Спробуйте, коли зʼявиться мережа.';
  }
  if (failure.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (failure.code === 'Validation') {
    const errors = failure.fieldErrors ?? {};
    if (errors['currentPassword']) return 'Невірний поточний пароль.';
    const photo = errors['file']?.[0];
    if (photo) return photoMessages[photo] ?? 'Це фото не підходить. Спробуйте інше.';
    return 'Перевірте введені дані.';
  }
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
