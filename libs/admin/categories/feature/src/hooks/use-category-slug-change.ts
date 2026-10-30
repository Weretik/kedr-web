import { useChangeCategorySlugMutation } from '@admin/categories/data-access';
import { slugChangeErrorMessage } from '@admin/shared/ui';
import { useState } from 'react';

import type { SlugChange } from '@admin/categories/data-access';

/** Address dialog state and the change request for one category (R-004). */
export function useCategorySlugChange(categoryId: number, onChanged: (message: string) => void) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [changeSlug, state] = useChangeCategorySlugMutation();

  const submit = async (input: SlugChange) => {
    setError(undefined);
    try {
      const result = await changeSlug({ id: categoryId, input }).unwrap();
      setOpen(false);
      onChanged(
        result.slug === result.previousSlug
          ? 'Адреса не змінилась.'
          : `Нова адреса: ${result.slug}`,
      );
    } catch (requestError) {
      setError(slugChangeErrorMessage(requestError));
    }
  };

  return {
    close: () => setOpen(false),
    error,
    open,
    openDialog: () => {
      setError(undefined);
      setOpen(true);
    },
    saving: state.isLoading,
    submit,
  };
}
