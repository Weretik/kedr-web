import { getProductPurchaseMode } from '@site/product/model';

import type { ProductDetails } from '@site/product/model';

/** Public structural handoff; app composition supplies the purchase owner without a domain import. */
export type ProductPurchaseDescriptor = {
  productId: string;
  title: string;
  unitPrice: number | null;
  currency: 'UAH';
  slug: string;
  imageUrl?: string;
  available: boolean;
};

export function productPurchaseDescriptor(product: ProductDetails): ProductPurchaseDescriptor {
  const imageUrl = product.media.find((item) => item.kind === 'photo')?.url;
  return {
    productId: product.sku,
    title: product.name,
    unitPrice: product.price,
    currency: 'UAH',
    slug: product.slug,
    ...(imageUrl ? { imageUrl } : {}),
    available: getProductPurchaseMode(product) === 'cart',
  };
}
