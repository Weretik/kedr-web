import {
  useAcceptProductReviewMutation,
  useGetAttributeOptionsQuery,
  useGetAttributeValueOptionsQuery,
  useGetProductAttributesQuery,
  useReopenProductReviewMutation,
  useRestoreProductAttributeMutation,
  useSetProductAttributeMutation,
} from '@admin/site-models/data-access';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { siteModelsErrorMessage } from '../errors/site-models-error-message';

import type { ProductAttribute, ProductAttributeInput } from '@admin/site-models/model';

/** The dialog of one attribute: an existing one, or a new one whose attribute a person picks. */
type DialogState = { attribute: ProductAttribute | null; attributeId: number | null } | null;

/** «Ознаки» and «Перевірка» of one product: values, the edit dialog, revert, and review decisions. */
export function useProductAttributesEditor(productId: number) {
  const query = useGetProductAttributesQuery(productId);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const attributeOptions = useGetAttributeOptionsQuery(
    dialog && !dialog.attribute ? undefined : skipToken,
  );
  const valueOptions = useGetAttributeValueOptionsQuery(dialog?.attributeId ?? skipToken);
  const [setAttribute, setState] = useSetProductAttributeMutation();
  const [restore, restoreState] = useRestoreProductAttributeMutation();
  const [accept, acceptState] = useAcceptProductReviewMutation();
  const [reopen, reopenState] = useReopenProductReviewMutation();
  const present = new Set(query.data?.attributes.map((attribute) => attribute.attributeId));

  return {
    data: query.data,
    loading: query.isLoading,
    loadError: query.isError,
    retry: query.refetch,
    busy: setState.isLoading || restoreState.isLoading,
    reviewBusy: acceptState.isLoading || reopenState.isLoading,
    error,
    reviewError,
    dialog,
    dialogError,
    saving: setState.isLoading,
    attributeOptions: (attributeOptions.data ?? []).filter((option) => !present.has(option.id)),
    valueOptions: valueOptions.data ?? [],
    valuesLoading: valueOptions.isFetching,
    openEdit: (attribute: ProductAttribute) => {
      setDialogError(null);
      setDialog({ attribute, attributeId: attribute.attributeId });
    },
    openAdd: () => {
      setDialogError(null);
      setDialog({ attribute: null, attributeId: null });
    },
    chooseAttribute: (attributeId: number | null) =>
      setDialog((current) => current && { ...current, attributeId }),
    closeDialog: () => setDialog(null),
    save: async (attributeId: number, input: ProductAttributeInput) => {
      setDialogError(null);
      try {
        await setAttribute({ productId, attributeId, input }).unwrap();
        setDialog(null);
      } catch (cause) {
        setDialogError(siteModelsErrorMessage(cause));
      }
    },
    restore: async (attribute: ProductAttribute) => {
      setError(null);
      try {
        await restore({ productId, attributeId: attribute.attributeId }).unwrap();
      } catch (cause) {
        setError(siteModelsErrorMessage(cause));
      }
    },
    accept: async () => {
      setReviewError(null);
      try {
        await accept(productId).unwrap();
      } catch (cause) {
        setReviewError(siteModelsErrorMessage(cause));
      }
    },
    reopen: async () => {
      setReviewError(null);
      try {
        await reopen(productId).unwrap();
      } catch (cause) {
        setReviewError(siteModelsErrorMessage(cause));
      }
    },
  };
}
