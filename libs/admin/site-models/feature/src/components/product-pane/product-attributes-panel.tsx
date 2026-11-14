import { AdminEditPanel } from '@admin/shared/ui';

import { ProductAttributesSection } from './product-attributes-section';

export interface EditedSiteProduct {
  productId: number;
  name: string;
}

/** The right-side panel with all attributes and the review of one product. */
export function ProductAttributesPanel({
  onClose,
  product,
}: {
  product: EditedSiteProduct | undefined;
  onClose: () => void;
}) {
  return (
    <AdminEditPanel
      onClose={onClose}
      open={product !== undefined}
      subtitle={product ? `${product.name} · Код 1С ${product.productId}` : undefined}
      title="Ознаки товару"
    >
      {product ? <ProductAttributesSection productId={product.productId} /> : null}
    </AdminEditPanel>
  );
}
