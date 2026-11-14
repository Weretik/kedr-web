import type { ContentLanguage } from '@admin/categories/model';

/** Short mark for missing site texts; nothing when every language has text or the list did not say. */
export function contentProblemLabel(missing: readonly ContentLanguage[] | null): string | null {
  if (!missing || missing.length === 0) return null;
  if (missing.length > 1) return 'Немає тексту';
  return missing[0] === 'ru' ? 'Немає RU' : 'Немає UK';
}
