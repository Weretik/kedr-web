import {
  useAcceptSiteModelsMutation,
  useAddSiteModelProductsMutation,
  useFillSiteModelFromNamesMutation,
  useGetSiteModelQuery,
  useRemoveSiteModelProductMutation,
  useRenameSiteModelMutation,
  useSetProductAttributeMutation,
  useSetSiteModelAxesMutation,
  useSetSiteModelTextMutation,
} from '@admin/site-models/data-access';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import { siteModelsErrorMessage } from '../errors/site-models-error-message';

import type { SiteModelLanguage, SiteModelTextInput } from '@admin/site-models/model';

type ErrorPlace = 'header' | 'axes' | 'products' | 'texts' | 'add';

/** The model card: every change, and the error of the block it came from. */
export function useSiteModelEditor(id: number | undefined, onNotice: (text: string) => void) {
  const query = useGetSiteModelQuery(id ?? skipToken);
  const [errors, setErrors] = useState<Partial<Record<ErrorPlace, string>>>({});
  const [accept, acceptState] = useAcceptSiteModelsMutation();
  const [rename, renameState] = useRenameSiteModelMutation();
  const [setAxes, axesState] = useSetSiteModelAxesMutation();
  const [addProducts, addState] = useAddSiteModelProductsMutation();
  const [removeProduct, removeState] = useRemoveSiteModelProductMutation();
  const [fill, fillState] = useFillSiteModelFromNamesMutation();
  const [setText, textState] = useSetSiteModelTextMutation();
  const [setValue, valueState] = useSetProductAttributeMutation();

  /** Runs a change; returns whether it worked and shows its error in its block. */
  const run = async (place: ErrorPlace, change: () => Promise<unknown>, notice?: string) => {
    setErrors((current) => ({ ...current, [place]: undefined }));
    try {
      await change();
      if (notice) onNotice(notice);
      return true;
    } catch (cause) {
      setErrors((current) => ({ ...current, [place]: siteModelsErrorMessage(cause) }));
      return false;
    }
  };

  return {
    model: query.data,
    loading: query.isLoading,
    loadError: query.isError,
    retry: query.refetch,
    errors,
    clearError: (place: ErrorPlace) => setErrors((current) => ({ ...current, [place]: undefined })),
    headerBusy: acceptState.isLoading || renameState.isLoading,
    axesBusy: axesState.isLoading,
    productsBusy:
      removeState.isLoading || fillState.isLoading || valueState.isLoading || addState.isLoading,
    adding: addState.isLoading,
    textSaving: textState.isLoading,
    renaming: renameState.isLoading,
    accept: (modelId: number) => run('header', () => accept([modelId]).unwrap(), 'Модель прийнято'),
    rename: (modelId: number, name: string) =>
      run('header', () => rename({ id: modelId, name }).unwrap(), 'Назву змінено'),
    setAxes: (modelId: number, attributeIds: number[]) =>
      run('axes', () => setAxes({ id: modelId, attributeIds }).unwrap()),
    addProducts: (modelId: number, productIds: number[]) =>
      run('add', () => addProducts({ id: modelId, productIds }).unwrap(), 'Товари додано'),
    removeProduct: (modelId: number, productId: number) =>
      run(
        'products',
        () => removeProduct({ id: modelId, productId }).unwrap(),
        'Товар прибрано з моделі',
      ),
    fillFromNames: (modelId: number) =>
      run('products', () => fill(modelId).unwrap(), 'Ознаки заповнено з назв'),
    setValue: (productId: number, attributeId: number, valueId: number) =>
      run('products', () =>
        setValue({ productId, attributeId, input: { valueIds: [valueId] } }).unwrap(),
      ),
    saveText: (modelId: number, language: SiteModelLanguage, text: SiteModelTextInput) =>
      run('texts', () => setText({ id: modelId, language, text }).unwrap(), 'Тексти збережено'),
  };
}
