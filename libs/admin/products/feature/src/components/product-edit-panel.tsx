import { AdminEditPanel, SlugEditCard } from '@admin/shared/ui';

import { ProductMediaSection } from './product-media-section';
import { useProductSlugChange } from '../hooks/use-product-slug-change';

const publicPathPrefix = '/uk/product/';

export interface EditedProduct {
  id: number;
  nameUk: string;
  productSlug: string;
}

interface ProductEditPanelProps {
  product: EditedProduct | undefined;
  open: boolean;
  /** Administrators also change the site address; managers edit photos only. */
  canEditSlug: boolean;
  onClose: () => void;
  onSlugChanged: (slug: string) => void;
}

/**
 * What the admin may edit in a product: photos and scheme, and the site address. Names, prices, and
 * stock come from 1С and stay read-only.
 */
export function ProductEditPanel({
  canEditSlug,
  onClose,
  onSlugChanged,
  open,
  product,
}: ProductEditPanelProps) {
  const slugChange = useProductSlugChange(product?.id, onSlugChanged);

  return (
    <AdminEditPanel
      busy={slugChange.saving}
      onClose={onClose}
      open={open && product !== undefined}
      subtitle={product ? `${product.nameUk} · ID ${product.id}` : undefined}
      title="Редагування товару"
    >
      {product ? (
        <>
          <ProductMediaSection productId={product.id} />
          {canEditSlug ? (
            <SlugEditCard
              currentSlug={product.productSlug}
              error={slugChange.error}
              onSubmit={(input) => void slugChange.submit(input)}
              pathPrefix={publicPathPrefix}
              saving={slugChange.saving}
            />
          ) : null}
        </>
      ) : null}
    </AdminEditPanel>
  );
}
