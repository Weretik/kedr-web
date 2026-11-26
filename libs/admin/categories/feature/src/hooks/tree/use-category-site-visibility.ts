import { useSetCategorySiteVisibilityMutation } from '@admin/categories/data-access';
import { useState } from 'react';

import type { AdminCategory } from '@admin/categories/model';

/**
 * «Показати на сайті» / «Сховати з сайту» of any category: from a row switch or the page header, the confirm dialog
 * first, then the change (spec 003 R-003).
 */
export function useCategorySiteVisibility(onNotice: (message: string) => void) {
  const [target, setTarget] = useState<AdminCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [setSiteVisibility, state] = useSetCategorySiteVisibilityMutation();

  const confirm = async () => {
    if (!target || state.isLoading) return;
    setError(null);
    try {
      await setSiteVisibility({ id: target.id, isShownOnSite: !target.isShownOnSite }).unwrap();
      setTarget(null);
      onNotice(
        target.isShownOnSite ? 'Категорію сховано з сайту.' : 'Категорію показано на сайті.',
      );
    } catch {
      setError('Не вдалося змінити показ на сайті. Спробуйте ще раз.');
    }
  };

  return {
    target,
    error,
    submitting: state.isLoading,
    ask: (category: AdminCategory) => {
      setError(null);
      setTarget(category);
    },
    cancel: () => setTarget(null),
    confirm,
  };
}
