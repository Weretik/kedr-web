import { isConflict } from '@admin/shared/api-client';

interface PlacementApiError {
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Turns an error of a create, move, order, delete, or add-models request into a message (spec 002). The server
 * already writes its checks in Ukrainian («У цій категорії є моделі…»), so they are shown as they are.
 */
export function categoryPlacementErrorMessage(
  error: unknown,
  messages: { conflict: string; fallback: string },
): string {
  if (isConflict(error)) return messages.conflict;
  const apiError = (typeof error === 'object' && error !== null ? error : {}) as PlacementApiError;
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'NotFound')
    return 'Категорію чи модель не знайдено: можливо, її вже видалено.';
  if (apiError.code === 'Validation') {
    const details = Object.values(apiError.fieldErrors ?? {}).flat();
    return details.length > 0 ? details.join(' ') : apiError.message || messages.fallback;
  }
  return messages.fallback;
}
