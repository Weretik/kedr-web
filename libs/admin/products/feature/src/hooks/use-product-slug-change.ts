import { useChangeProductSlugMutation } from '@admin/products/data-access';
import { slugChangeErrorMessage } from '@admin/shared/ui';
import { useState } from 'react';

import type { ProductSlugChange } from '@admin/products/data-access';

/** Address dialog state for one product; the page moves to the new address after a change. */
export function useProductSlugChange(
  productId: number | undefined,
  onChanged: (slug: string) => void,
) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [changeSlug, state] = useChangeProductSlugMutation();

  const submit = async (input: ProductSlugChange) => {
    if (productId === undefined) return;
    setError(undefined);
    try {
      const result = await changeSlug({ id: productId, input }).unwrap();
      setOpen(false);
      onChanged(result.slug);
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
