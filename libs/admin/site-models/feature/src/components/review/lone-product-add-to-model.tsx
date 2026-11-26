import {
  useAddSiteModelProductsMutation,
  useGetSiteModelsQuery,
} from '@admin/site-models/data-access';
import { similarModelForProduct } from '@admin/site-models/model';
import { LoneProductModelPicker } from '@admin/site-models/ui';

import { siteModelsErrorMessage } from '../../errors/site-models-error-message';

import type { SiteShowcaseItem } from '@admin/site-models/model';

/** The most models of one category the picker loads (the server's page limit). */
const MODELS_PAGE_SIZE = 200;

interface LoneProductAddToModelProps {
  product: SiteShowcaseItem;
  onNotice: (text: string) => void;
}

/** «Додати в модель» of one product in no model: models of its category, a similar one picked first. */
export function LoneProductAddToModel({ onNotice, product }: LoneProductAddToModelProps) {
  const models = useGetSiteModelsQuery({
    categoryId: product.categoryId,
    page: 1,
    pageSize: MODELS_PAGE_SIZE,
  });
  const [add, addState] = useAddSiteModelProductsMutation();
  const items = models.data?.items ?? [];

  const submit = async (modelId: number) => {
    try {
      const model = await add({ id: modelId, productIds: [product.productId] }).unwrap();
      onNotice(`Товар додано в модель «${model.name}»`);
    } catch (error) {
      onNotice(siteModelsErrorMessage(error));
    }
  };

  return (
    <LoneProductModelPicker
      loading={models.isLoading}
      models={items}
      onAdd={(modelId) => void submit(modelId)}
      pending={addState.isLoading}
      suggestedId={similarModelForProduct(product, items)?.id}
    />
  );
}
