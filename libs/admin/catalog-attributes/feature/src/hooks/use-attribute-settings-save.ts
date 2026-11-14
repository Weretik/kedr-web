import { useUpdateCatalogAttributeMutation } from '@admin/catalog-attributes/data-access';
import { useState } from 'react';

import { catalogAttributesErrorMessage } from '../errors/catalog-attributes-error-message';

import type { CatalogAttributeChange } from '@admin/catalog-attributes/model';

/** Saves the settings card of one attribute and keeps its error. */
export function useAttributeSettingsSave(
  attributeId: number | undefined,
  onNotice: (message: string) => void,
) {
  const [updateAttribute, state] = useUpdateCatalogAttributeMutation();
  const [error, setError] = useState<string | null>(null);

  const save = async (change: CatalogAttributeChange) => {
    if (attributeId === undefined) return;
    setError(null);
    try {
      await updateAttribute({ id: attributeId, change }).unwrap();
      onNotice('Властивість збережено.');
    } catch (cause) {
      setError(catalogAttributesErrorMessage(cause));
    }
  };

  return { save, error, saving: state.isLoading };
}
