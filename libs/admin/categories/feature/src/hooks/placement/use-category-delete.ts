import { useDeleteCategoryMutation } from '@admin/categories/data-access';
import { useState } from 'react';

import { categoryPlacementErrorMessage } from '../../errors/category-placement-error-message';

import type { AdminCategory } from '@admin/categories/model';

const messages = {
  conflict: 'Спочатку приберіть моделі та підкатегорії.',
  fallback: 'Не вдалося видалити категорію. Спробуйте ще раз.',
};

/** «Видалити» of a manual category: the confirm dialog and the delete (spec 002 R-004). */
export function useCategoryDelete(
  category: AdminCategory,
  onDeleted: (parentId: number | null) => void,
) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remove, state] = useDeleteCategoryMutation();

  const confirm = async () => {
    if (state.isLoading) return;
    setError(null);
    try {
      await remove(category.id).unwrap();
      setOpen(false);
      onDeleted(category.parentId);
    } catch (cause) {
      setError(categoryPlacementErrorMessage(cause, messages));
    }
  };

  return {
    canDelete: category.isManual,
    open,
    error,
    deleting: state.isLoading,
    ask: () => {
      setError(null);
      setOpen(true);
    },
    cancel: () => setOpen(false),
    confirm,
  };
}
