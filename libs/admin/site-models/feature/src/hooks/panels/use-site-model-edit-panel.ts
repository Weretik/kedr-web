import {
  useChangeSiteModelCategoryMutation,
  useGetAttributeOptionsQuery,
  useGetSiteModelCategoriesQuery,
} from '@admin/site-models/data-access';
import { siteFinalCategories } from '@admin/site-models/model';
import { useMemo, useState } from 'react';

import { siteModelsErrorMessage } from '../../errors/site-models-error-message';
import { useSiteModelEditor } from '../model-editor/use-site-model-editor';

/** «Редагування моделі»: the model editor plus the site category, each block saving on its own (spec 001 R-004). */
export function useSiteModelEditPanel(modelId: number, onNotice: (text: string) => void) {
  const editor = useSiteModelEditor(modelId, onNotice);
  const categoriesQuery = useGetSiteModelCategoriesQuery();
  const attributeOptions = useGetAttributeOptionsQuery();
  const [changeCategory, categoryState] = useChangeSiteModelCategoryMutation();
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const categories = useMemo(
    () => siteFinalCategories(categoriesQuery.data ?? []),
    [categoriesQuery.data],
  );

  const saveCategory = async (categoryId: number) => {
    setCategoryError(null);
    try {
      await changeCategory({ id: modelId, categoryId }).unwrap();
      onNotice('Категорію змінено');
    } catch (cause) {
      setCategoryError(siteModelsErrorMessage(cause));
    }
  };

  return {
    editor,
    categories,
    categoriesLoading: categoriesQuery.isLoading,
    attributeOptions: attributeOptions.data ?? [],
    categorySaving: categoryState.isLoading,
    categoryError,
    saveCategory: (categoryId: number) => void saveCategory(categoryId),
    busy: editor.headerBusy || editor.axesBusy || editor.textSaving || categoryState.isLoading,
  };
}
