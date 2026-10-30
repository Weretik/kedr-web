import type { components } from '@shared/api-contracts';
import type { ProductSummary } from '@site/catalog/model';

type ProductListItem = components['schemas']['ProductListItem'];

/** Product photos are served by this CDN; keep in sync with `images.remotePatterns` in `apps/site/next.config.ts`. */
export const PRODUCT_IMAGE_HOST = 'images-kedr.cdn.express';

/** Only HTTPS photos on the image CDN reach `next/image`; anything else falls back to the placeholder. */
export function toProductPhotoUrl(photo: string | null | undefined): string | null {
  if (!photo) return null;
  try {
    const url = new URL(photo);
    return url.protocol === 'https:' && url.hostname === PRODUCT_IMAGE_HOST ? url.toString() : null;
  } catch {
    return null;
  }
}

export function mapProductSummary(item: ProductListItem): ProductSummary {
  return {
    id: item.id,
    slug: item.productSlug,
    name: item.name.trim(),
    price: typeof item.price === 'number' && item.price > 0 ? item.price : null,
    photoUrl: toProductPhotoUrl(item.photo),
    isNew: item.isNew,
    isSale: item.isSale,
  };
}
