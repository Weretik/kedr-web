import { useChangeCategorySlugMutation } from '@admin/categories/data-access';
import { slugChangeErrorMessage } from '@admin/shared/ui';
import { useState } from 'react';

import type { SlugChange } from '@admin/categories/data-access';

/** Address change request for one category in its edit panel (R-004). */
export function useCategorySlugChange(categoryId: number, onChanged: (message: string) => void) {
  const [error, setError] = useState<string | undefined>();
  const [changeSlug, state] = useChangeCategorySlugMutation();

  const submit = async (input: SlugChange) => {
    setError(undefined);
    try {
      const result = await changeSlug({ id: categoryId, input }).unwrap();
      onChanged(
        result.slug === result.previousSlug
          ? 'Адреса не змінилась.'
          : `Нова адреса: ${result.slug}`,
      );
    } catch (requestError) {
      setError(slugChangeErrorMessage(requestError));
    }
  };

  return { error, saving: state.isLoading, submit };
}
