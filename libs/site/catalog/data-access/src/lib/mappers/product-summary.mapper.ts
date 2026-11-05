import type { components } from '@shared/api-contracts';
import type { ProductSummary, ProductSwatch } from '@site/catalog/model';

type ProductListItem = components['schemas']['ProductListItem'];
type ApiSwatch = components['schemas']['ProductSwatch'];

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
    sku: item.id,
    slug: item.productSlug,
    name: item.name.trim(),
    price: typeof item.price === 'number' && item.price > 0 ? item.price : null,
    photoUrl: toProductPhotoUrl(item.photo),
    inStock: item.inStock,
    isNew: item.isNew,
    isSale: item.isSale,
    ...(typeof item.variantCount === 'number' &&
      item.variantCount > 1 && { variantCount: item.variantCount }),
    ...(item.swatches?.length && { swatches: item.swatches.map(mapSwatch) }),
  };
}

const HEX = /^#[0-9a-f]{6}$/i;

/** Swatch texture pictures live in the media library on the same CDN as product photos. */
export function mapSwatch(swatch: ApiSwatch): ProductSwatch {
  return {
    slug: swatch.slug,
    name: swatch.name,
    hex: swatch.hex && HEX.test(swatch.hex) ? swatch.hex : null,
    textureUrl: toProductPhotoUrl(swatch.textureUrl),
  };
}
