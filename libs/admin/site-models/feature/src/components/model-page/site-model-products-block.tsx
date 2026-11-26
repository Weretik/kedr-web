import { SiteModelProductsCard } from '@admin/site-models/ui';

import { useAxisValueOptions } from '../../hooks/model-editor/use-axis-value-options';

import type { useSiteModelEditor } from '../../hooks/model-editor/use-site-model-editor';
import type { EditedSiteProduct } from '../product-pane/product-attributes-panel';
import type { SiteModel } from '@admin/site-models/model';

interface SiteModelProductsBlockProps {
  model: SiteModel;
  editor: ReturnType<typeof useSiteModelEditor>;
  onAdd: () => void;
  onEditAttributes: (product: EditedSiteProduct) => void;
}

/**
 * «Товари й ознаки» of the model page. The axis value pickers in product rows stay inline: a value is one click per
 * product (owner-accepted exception to the read-only page, spec 001 R-003).
 */
export function SiteModelProductsBlock({
  editor,
  model,
  onAdd,
  onEditAttributes,
}: SiteModelProductsBlockProps) {
  const axisValues = useAxisValueOptions(model.axes);
  return (
    <SiteModelProductsCard
      axes={model.axes}
      axisValues={axisValues}
      busy={editor.productsBusy}
      error={editor.errors.products ?? null}
      onAdd={onAdd}
      onCreateValue={editor.createValue}
      onEditAttributes={(product) =>
        onEditAttributes({ productId: product.productId, name: product.name })
      }
      onFillFromNames={() => void editor.fillFromNames(model.id)}
      onRemove={(product) => void editor.removeProduct(model.id, product.productId)}
      onSetValue={(productId, attributeId, valueId) =>
        void editor.setValue(productId, attributeId, valueId)
      }
      products={model.products}
    />
  );
}
