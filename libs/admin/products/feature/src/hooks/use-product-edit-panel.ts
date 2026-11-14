import { useCallback, useState } from 'react';

import type { EditedProduct } from '../components/product-edit-panel';
import type { AdminProductListItem } from '@admin/products/model';

/** The product edit side panel of the list: which product, open or closed, and the slug notice. */
export function useProductEditPanel() {
  // The last edited product stays set after closing so its panel can reopen without a reload.
  const [product, setProduct] = useState<EditedProduct | undefined>();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const edit = useCallback((item: AdminProductListItem) => {
    setProduct({ id: item.id, nameUk: item.nameUk, productSlug: item.productSlug });
    setOpen(true);
  }, []);

  const slugChanged = (slug: string) => {
    setProduct((current) => current && { ...current, productSlug: slug });
    setNotice(`Нова адреса: ${slug}`);
  };

  return {
    product,
    open,
    notice,
    edit,
    slugChanged,
    close: () => setOpen(false),
    clearNotice: () => setNotice(null),
  };
}
