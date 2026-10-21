import {
  useDeleteWorkspaceDraftMutation,
  useLazyGetWorkspaceDraftQuery,
} from '@admin/orders/data-access';
import { useState } from 'react';

import type { DraftRecord, DraftSummary } from '@admin/orders/model';

export function useDraftDeletion() {
  const [selected, setSelected] = useState<DraftRecord | null>(null);
  const [error, setError] = useState('');
  const [loadDraft] = useLazyGetWorkspaceDraftQuery();
  const [deleteDraft, deletion] = useDeleteWorkspaceDraftMutation();

  const select = async (row: DraftSummary) => {
    setError('');
    try {
      setSelected(await loadDraft(row.draftId, false).unwrap());
    } catch {
      setError('Не вдалося завантажити чернетку для підтвердження видалення.');
    }
  };
  const remove = async () => {
    if (!selected) return;
    setError('');
    try {
      await deleteDraft({ draftId: selected.draftId, version: selected.version }).unwrap();
      setSelected(null);
    } catch (cause) {
      setError(
        (cause as { status?: number }).status === 409
          ? 'Чернетку змінили в іншій вкладці. Оновіть список і повторіть дію.'
          : 'Не вдалося видалити чернетку. Спробуйте ще раз.',
      );
    }
  };
  return {
    selected,
    error,
    deleting: deletion.isLoading,
    select,
    remove,
    close: () => setSelected(null),
  };
}
