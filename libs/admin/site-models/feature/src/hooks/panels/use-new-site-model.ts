import {
  useCreateSiteModelMutation,
  useGetSiteCategoryOptionsQuery,
} from '@admin/site-models/data-access';
import { siteFinalCategories } from '@admin/site-models/model';
import { useMemo, useState } from 'react';

import { useProductCandidates } from './use-product-candidates';
import { siteModelsErrorMessage } from '../../errors/site-models-error-message';

import type { NewSiteModelOptions } from '../../components/panels/site-model-panels-context';

interface PickedProduct {
  productId: number;
  name: string;
}

const noExclusions: readonly number[] = [];

/** «Нова модель»: name, final site category, picked products and the create call (spec 001 R-005). */
export function useNewSiteModel(
  options: NewSiteModelOptions,
  /** Opens the new model with the notice to show there. */
  onCreated: (modelId: number, notice: string) => void,
) {
  const categoriesQuery = useGetSiteCategoryOptionsQuery();
  const categories = useMemo(
    () => siteFinalCategories(categoriesQuery.data ?? []),
    [categoriesQuery.data],
  );
  const [name, setName] = useState(options.name ?? '');
  const [categoryId, setCategoryId] = useState(options.categoryId);
  const [picked, setPicked] = useState<PickedProduct[]>(() =>
    (options.productIds ?? []).map((productId) => ({ productId, name: `Код 1С ${productId}` })),
  );
  const [error, setError] = useState<string | null>(null);
  const products = useProductCandidates(noExclusions);
  const [create, createState] = useCreateSiteModelMutation();

  // A product that came with the panel shows its name once the list has it.
  const names = new Map(products.candidates.map((item) => [item.productId, item.name] as const));
  const selected = picked.map((item) => ({
    ...item,
    name: names.get(item.productId) ?? item.name,
  }));
  const finalCategoryId = categories.some((category) => category.id === categoryId)
    ? categoryId
    : undefined;

  const toggle = (product: PickedProduct) =>
    setPicked((current) =>
      current.some((item) => item.productId === product.productId)
        ? current.filter((item) => item.productId !== product.productId)
        : [...current, { productId: product.productId, name: product.name }],
    );

  const submit = async () => {
    if (!name.trim() || finalCategoryId === undefined || createState.isLoading) return;
    setError(null);
    try {
      const model = await create({
        categoryId: finalCategoryId,
        name: name.trim(),
        productIds: picked.map((item) => item.productId),
      }).unwrap();
      onCreated(model.id, 'Модель створено');
    } catch (cause) {
      setError(siteModelsErrorMessage(cause));
    }
  };

  return {
    name,
    categoryId: finalCategoryId,
    categories,
    categoriesLoading: categoriesQuery.isLoading,
    search: products.search,
    candidates: products.candidates,
    candidatesLoading: products.loading,
    selected,
    saving: createState.isLoading,
    error,
    onNameChange: setName,
    onCategoryChange: setCategoryId,
    onToggle: toggle,
    onSubmit: () => void submit(),
  };
}
