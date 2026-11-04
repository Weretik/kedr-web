import type { ProductSummary } from '@site/catalog/model';
import type { ReactNode } from 'react';

/** Structural handoff to the cart domain, which the catalog cannot import; the app composes both. */
export type ListingPurchaseDescriptor = {
  productId: string;
  title: string;
  unitPrice: number | null;
  currency: 'UAH';
  slug: string;
  imageUrl?: string;
  available: boolean;
};

/** Executed on the server for each listed product; only the returned node reaches the card or row. */
export type RenderListingPurchaseAction = (descriptor: ListingPurchaseDescriptor) => ReactNode;

export function listingPurchaseDescriptor(product: ProductSummary): ListingPurchaseDescriptor {
  return {
    productId: String(product.sku),
    title: product.name,
    unitPrice: product.price,
    currency: 'UAH',
    slug: product.slug,
    ...(product.photoUrl ? { imageUrl: product.photoUrl } : {}),
    available: product.inStock && product.price !== null && product.price > 0,
  };
}
