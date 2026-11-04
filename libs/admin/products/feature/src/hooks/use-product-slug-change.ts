import { useChangeProductSlugMutation } from '@admin/products/data-access';
import { slugChangeErrorMessage } from '@admin/shared/ui';
import { useState } from 'react';

import type { ProductSlugChange } from '@admin/products/data-access';

/** Address change request for one product in its edit panel; the caller reacts to the new address. */
export function useProductSlugChange(
  productId: number | undefined,
  onChanged: (slug: string) => void,
) {
  const [error, setError] = useState<string | undefined>();
  const [changeSlug, state] = useChangeProductSlugMutation();

  const submit = async (input: ProductSlugChange) => {
    if (productId === undefined) return;
    setError(undefined);
    try {
      const result = await changeSlug({ id: productId, input }).unwrap();
      onChanged(result.slug);
    } catch (requestError) {
      setError(slugChangeErrorMessage(requestError));
    }
  };

  return { error, saving: state.isLoading, submit };
}
