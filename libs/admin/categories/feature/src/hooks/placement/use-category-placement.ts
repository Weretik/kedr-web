import { useMoveCategoryMutation, useReorderCategoryMutation } from '@admin/categories/data-access';
import { categoryNeighbourPosition, categoryParentOptions } from '@admin/categories/model';
import { useMemo, useState } from 'react';

import { categoryPlacementErrorMessage } from '../../errors/category-placement-error-message';

import type { AdminCategory } from '@admin/categories/model';

const messages = {
  conflict: 'Категорію змінили одночасно. Спробуйте ще раз.',
  fallback: 'Не вдалося перемістити категорію.',
};

/** «Розташування» of any category: the move dialog and «Вище» / «Нижче» (spec 002 R-003, spec 003 R-011). */
export function useCategoryPlacement(
  category: AdminCategory,
  categories: readonly AdminCategory[],
  onNotice: (message: string) => void,
) {
  const [draft, setDraft] = useState(category.parentId);
  const [base, setBase] = useState(category);
  const [error, setError] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [move, moving] = useMoveCategoryMutation();
  const [reorder, reordering] = useReorderCategoryMutation();
  const options = useMemo(
    () => categoryParentOptions(categories, category.id),
    [categories, category.id],
  );
  const busy = moving.isLoading || reordering.isLoading;

  // A reloaded or another category becomes the new starting value.
  if (base !== category) {
    setBase(category);
    setDraft(category.parentId);
    setError(undefined);
  }

  const run = async (action: () => Promise<unknown>, done: string) => {
    if (busy) return false;
    setError(undefined);
    try {
      await action();
      onNotice(done);
      return true;
    } catch (cause) {
      setError(categoryPlacementErrorMessage(cause, messages));
      return false;
    }
  };

  return {
    draft,
    options,
    error,
    busy,
    dirty: draft !== category.parentId,
    ...categoryNeighbourPosition(categories, category),
    setDraft,
    dialogOpen,
    /** «Перемістити» opens the dialog with the current parent (spec 003 R-011). */
    startMove: () => {
      setDraft(category.parentId);
      setError(undefined);
      setDialogOpen(true);
    },
    closeMove: () => setDialogOpen(false),
    save: async () => {
      if (
        await run(
          () => move({ id: category.id, parentId: draft }).unwrap(),
          'Категорію переміщено.',
        )
      )
        setDialogOpen(false);
    },
    move: (direction: 'up' | 'down') =>
      run(() => reorder({ id: category.id, direction }).unwrap(), 'Порядок змінено.'),
  };
}
