import { useSetCategorySiteVisibilityMutation } from '@admin/categories/data-access';
import { useState } from 'react';

import type { AdminCategory } from '@admin/categories/model';

/** «Показати на сайті» / «Сховати з сайту»: the confirm dialog and the change itself. */
export function useCategorySiteVisibility(
  category: AdminCategory | undefined,
  onNotice: (message: string) => void,
) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setSiteVisibility, state] = useSetCategorySiteVisibilityMutation();

  const confirm = async () => {
    if (!category) return;
    setError(null);
    try {
      await setSiteVisibility({ id: category.id, isShownOnSite: !category.isShownOnSite }).unwrap();
      setOpen(false);
      onNotice(
        category.isShownOnSite ? 'Категорію сховано з сайту.' : 'Категорію показано на сайті.',
      );
    } catch {
      setError('Не вдалося змінити показ на сайті. Спробуйте ще раз.');
    }
  };

  return {
    open,
    error,
    submitting: state.isLoading,
    ask: () => {
      setError(null);
      setOpen(true);
    },
    cancel: () => setOpen(false),
    confirm,
  };
}
