import { SiteModelProductsPreview } from '@admin/site-models/ui';

import { useAxisValueOptions } from '../../hooks/model-editor/use-axis-value-options';
import { useSiteModelEditor } from '../../hooks/model-editor/use-site-model-editor';

import type { EditedSiteProduct } from '../product-pane/product-attributes-panel';

interface SiteModelProductsRowProps {
  modelId: number;
  onEditAttributes: (product: EditedSiteProduct) => void;
  onNotice: (text: string) => void;
}

/**
 * The products of a model opened by its arrow in «Моделі», read from the model (spec 001 R-002a), with the switcher
 * pickers and «Усі ознаки» to fix a value on the spot (R-002b).
 */
export function SiteModelProductsRow({
  modelId,
  onEditAttributes,
  onNotice,
}: SiteModelProductsRowProps) {
  const editor = useSiteModelEditor(modelId, onNotice);
  const axisValues = useAxisValueOptions(editor.model?.axes ?? []);
  return (
    <SiteModelProductsPreview
      editing={{
        axes: editor.model?.axes ?? [],
        axisValues,
        busy: editor.productsBusy,
        error: editor.errors.products ?? null,
        onSetValue: (productId, attributeId, valueId) =>
          void editor.setValue(productId, attributeId, valueId),
        onCreateValue: editor.createValue,
        onEditAttributes: (product) =>
          onEditAttributes({ productId: product.productId, name: product.name }),
      }}
      error={editor.loadError}
      loading={editor.loading}
      onRetry={() => void editor.retry()}
      products={editor.model?.products}
    />
  );
}
