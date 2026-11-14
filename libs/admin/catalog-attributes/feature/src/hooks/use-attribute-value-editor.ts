import {
  useCreateAttributeValueMutation,
  useUpdateAttributeValueMutation,
  useUploadAttributeSwatchMutation,
} from '@admin/catalog-attributes/data-access';
import { useState } from 'react';

import { catalogAttributesErrorMessage } from '../errors/catalog-attributes-error-message';

import type {
  CatalogAttributeValue,
  CatalogAttributeValueChange,
} from '@admin/catalog-attributes/model';
import type { SwatchTexture } from '@admin/catalog-attributes/ui';

/** The value being edited: `null` while adding a new one. */
export type ValueEdit = { value: CatalogAttributeValue | null } | undefined;

const textureOf = (value: CatalogAttributeValue | null | undefined): SwatchTexture | null =>
  value?.swatchMediaFileId ? { id: value.swatchMediaFileId, url: value.swatchImageUrl } : null;

/** The value form of one attribute: which value is open, its texture, upload, and save. */
export function useAttributeValueEditor(
  attributeId: number | undefined,
  initialEdit: ValueEdit,
  onNotice: (message: string) => void,
) {
  const [createValue, createState] = useCreateAttributeValueMutation();
  const [updateValue, updateState] = useUpdateAttributeValueMutation();
  const [uploadSwatch, uploadState] = useUploadAttributeSwatchMutation();
  const [edit, setEdit] = useState<ValueEdit>(initialEdit);
  const [error, setError] = useState<string | null>(null);
  const [texture, setTexture] = useState<SwatchTexture | null>(textureOf(initialEdit?.value));

  const open = (value: CatalogAttributeValue | null) => {
    setError(null);
    setTexture(textureOf(value));
    setEdit({ value });
  };

  const upload = async (file: File) => {
    setError(null);
    try {
      setTexture(await uploadSwatch(file).unwrap());
    } catch (cause) {
      setError(catalogAttributesErrorMessage(cause));
    }
  };

  const save = async (change: CatalogAttributeValueChange) => {
    if (attributeId === undefined || !edit) return;
    setError(null);
    try {
      if (edit.value) await updateValue({ attributeId, valueId: edit.value.id, change }).unwrap();
      else await createValue({ attributeId, change }).unwrap();
      setEdit(undefined);
      onNotice('Значення збережено.');
    } catch (cause) {
      setError(catalogAttributesErrorMessage(cause));
    }
  };

  return {
    edit,
    error,
    texture,
    setTexture,
    saving: createState.isLoading || updateState.isLoading,
    uploading: uploadState.isLoading,
    open,
    close: () => setEdit(undefined),
    upload,
    save,
  };
}
