import { formatDate } from '@mobile/shared/model';

/** Says why the customer's orders and drafts may be old: offline, a failed refresh, or nothing loaded yet. */
export function activityNote(
  fetchedAt: number | null,
  isOnline: boolean | null,
  failed: boolean,
): string | null {
  const since =
    fetchedAt === null ? null : `станом на ${formatDate(new Date(fetchedAt).toISOString())}`;
  if (failed) {
    return since ? `Не вдалося оновити, показано ${since}.` : 'Не вдалося завантажити замовлення.';
  }
  if (isOnline === false) {
    return since ? `Без мережі, показано ${since}.` : 'Без мережі замовлення ще не завантажені.';
  }
  return null;
}
