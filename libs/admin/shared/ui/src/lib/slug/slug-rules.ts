export const slugMaxLength = 80;

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Public address rule of the catalog backend: a–z, 0–9, single hyphens, at most 80 characters. */
export function validateSlug(value: string): string | undefined {
  const slug = value.trim();
  if (!slug) return 'Вкажіть адресу.';
  if (slug.length > slugMaxLength) return `Не більше ${slugMaxLength} символів.`;
  if (!slugPattern.test(slug)) {
    return 'Лише малі латинські літери, цифри та одинарні дефіси, без дефіса на початку чи в кінці.';
  }

  return undefined;
}

interface SlugApiError {
  code?: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}

/** Turns an error of a slug change request into a message for the dialog. */
export function slugChangeErrorMessage(error: unknown): string {
  const apiError = (typeof error === 'object' && error !== null ? error : {}) as SlugApiError;
  const slugErrors = Object.entries(apiError.fieldErrors ?? {})
    .filter(([field]) => field.toLowerCase() === 'slug')
    .flatMap(([, messages]) => messages);

  if (slugErrors.some((message) => message.includes('used by another'))) {
    return 'Ця адреса вже використовується або використовувалась раніше. Оберіть іншу.';
  }
  if (slugErrors.length > 0) return 'Адреса не підходить. Перевірте символи й довжину.';
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound') return 'Запис не знайдено: можливо, його вже видалено.';
  return 'Не вдалося змінити адресу. Спробуйте ще раз.';
}
