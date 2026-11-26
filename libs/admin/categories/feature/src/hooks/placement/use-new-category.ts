import { useCreateCategoryMutation } from '@admin/categories/data-access';
import { categoryNameError, categoryParentOptions } from '@admin/categories/model';
import { useMemo, useState } from 'react';

import { categoryPlacementErrorMessage } from '../../errors/category-placement-error-message';

import type { AdminCategory, NewCategoryDraft } from '@admin/categories/model';

const messages = {
  conflict: 'Категорія з такою назвою вже є тут.',
  fallback: 'Не вдалося створити категорію. Спробуйте ще раз.',
};

/** «Нова категорія»: the panel, its draft, and the create itself (spec 002 R-001). */
export function useNewCategory(
  categories: readonly AdminCategory[],
  onCreated: (categoryId: number) => void,
) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<NewCategoryDraft>({
    nameUk: '',
    nameRu: '',
    parentId: null,
    isShownOnSite: true,
  });
  const [showErrors, setShowErrors] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [create, state] = useCreateCategoryMutation();
  const options = useMemo(() => categoryParentOptions(categories), [categories]);

  // A new category takes its parent's «show on site» unless the person changes it.
  const shownUnder = (parentId: number | null) =>
    parentId === null
      ? true
      : (categories.find((row) => row.id === parentId)?.isShownOnSite ?? true);

  const start = (parentId: number | null) => {
    setDraft({ nameUk: '', nameRu: '', parentId, isShownOnSite: shownUnder(parentId) });
    setShowErrors(false);
    setError(undefined);
    setOpen(true);
  };

  const submit = async () => {
    if (state.isLoading) return;
    setShowErrors(true);
    if (categoryNameError(draft.nameUk) || categoryNameError(draft.nameRu)) return;
    setError(undefined);
    try {
      const created = await create({
        ...draft,
        nameUk: draft.nameUk.trim(),
        nameRu: draft.nameRu.trim(),
      }).unwrap();
      setOpen(false);
      onCreated(created.id);
    } catch (cause) {
      setError(categoryPlacementErrorMessage(cause, messages));
    }
  };

  return {
    open,
    draft,
    options,
    showErrors,
    error,
    saving: state.isLoading,
    start,
    change: setDraft,
    changeParent: (parentId: number | null) =>
      setDraft((current) => ({ ...current, parentId, isShownOnSite: shownUnder(parentId) })),
    close: () => setOpen(false),
    submit,
  };
}
