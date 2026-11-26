import type { RetailPriceStatusDto } from '@admin/retail-prices/data-access';
import type { ApiError } from '@admin/shared/api-client';

const kyivDateTime = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Kyiv',
});

/** «ціна», «ціни», «цін» by the Ukrainian plural rule. */
export function pricesWord(count: number): string {
  const lastTwo = count % 100;
  const last = count % 10;
  if (last === 1 && lastTwo !== 11) return 'ціна';
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'ціни';
  return 'цін';
}

/** Only a problem-worthy fact is shown: prices kept from 1C; nothing when none is locked. */
export function lockedStatusText(status: RetailPriceStatusDto): string | null {
  const count = status.lockedCount;
  if (count === 0) return null;
  const verb = pricesWord(count) === 'ціна' ? 'оновлюється' : 'оновлюються';
  const when = status.lastLockedAt
    ? ` (останнє завантаження ${kyivDateTime.format(new Date(status.lastLockedAt))})`
    : '';
  return `З 1С не ${verb} ${count} ${pricesWord(count)}${when}`;
}

/** Up to 50 codes come from the server; the rest is a count. */
export function codesText(codes: readonly string[], count: number): string {
  const rest = count - codes.length;
  return rest > 0 ? `${codes.join(', ')} і ще ${rest}` : codes.join(', ');
}

export const unlockConfirmText = (count: number) =>
  `Повернути ${count} ${pricesWord(count)} під 1С? Ціни зміняться при наступній синхронізації з 1С.`;

export const unlockedNotice = 'Ціни повернуто під 1С.';

const asApiError = (error: unknown) => (error ?? {}) as Partial<ApiError>;

/** 400 and 409 carry the server's Ukrainian reason; a too large file is stopped before the API. */
export function importErrorMessage(error: unknown): string {
  const { fieldErrors, message, status } = asApiError(error);
  if (status === 413) return 'Файл завеликий: до 10 МБ.';
  if (status === 400) return fieldErrors?.['file']?.[0] ?? message ?? 'Перевірте файл.';
  if (status === 409 && message) return message;
  return 'Не вдалося завантажити ціни. Спробуйте ще раз.';
}

export function unlockErrorMessage(error: unknown): string {
  const { message, status } = asApiError(error);
  if (status === 409 && message) return message;
  return 'Не вдалося повернути ціни під 1С. Спробуйте ще раз.';
}
