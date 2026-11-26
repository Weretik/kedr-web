import {
  useAddSiteModelProductsMutation,
  useGetSiteModelQuery,
} from '@admin/site-models/data-access';
import { AddModelProductsPanel } from '@admin/site-models/ui';
import { useMemo, useState } from 'react';

import { siteModelsErrorMessage } from '../../errors/site-models-error-message';
import { useProductCandidates } from '../../hooks/panels/use-product-candidates';

interface SiteModelAddProductsPanelProps {
  modelId: number;
  open: boolean;
  onClose: () => void;
  onNotice: (text: string) => void;
}

/** «Додати в модель» for a model: products of the whole catalog, free first, any 1C category (spec 001 R-006). */
export function SiteModelAddProductsPanel({
  modelId,
  onClose,
  onNotice,
  open,
}: SiteModelAddProductsPanelProps) {
  const model = useGetSiteModelQuery(modelId).data;
  const inModel = useMemo(() => model?.products.map((product) => product.productId) ?? [], [model]);
  const products = useProductCandidates(inModel, modelId);
  const [add, addState] = useAddSiteModelProductsMutation();
  const [error, setError] = useState<string | null>(null);

  const submit = async (productIds: number[]) => {
    setError(null);
    try {
      await add({ id: modelId, productIds }).unwrap();
      onNotice('Товари додано');
      onClose();
    } catch (cause) {
      setError(siteModelsErrorMessage(cause));
    }
  };

  return (
    <AddModelProductsPanel
      candidates={products.candidates}
      error={error}
      loading={products.loading}
      onAdd={(productIds) => void submit(productIds)}
      onClose={onClose}
      open={open}
      saving={addState.isLoading}
      search={products.search}
      subtitle={model ? `Модель «${model.name}» · ${model.categoryName}` : `Модель ${modelId}`}
    />
  );
}
