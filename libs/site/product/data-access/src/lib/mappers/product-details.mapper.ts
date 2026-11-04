import { isValidProductSlug } from '@site/product/model';

import { mapProductIdentity } from './product-identity';
import { mapProductMedia } from './product-media';

import type { ApiProductDetails } from '../contracts/product.dto';
import type { ProductBreadcrumb, ProductDetails } from '@site/product/model';

function mapBreadcrumbs(value: ApiProductDetails['breadcrumbs']): ProductBreadcrumb[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set<number>();
  const slugs = new Set<string>();
  const result: ProductBreadcrumb[] = [];
  for (const crumb of value) {
    if (
      !crumb ||
      !Number.isSafeInteger(crumb.id) ||
      crumb.id <= 0 ||
      typeof crumb.name !== 'string' ||
      !crumb.name.trim() ||
      !isValidProductSlug(crumb.slug) ||
      ids.has(crumb.id) ||
      slugs.has(crumb.slug)
    )
      continue;
    ids.add(crumb.id);
    slugs.add(crumb.slug);
    result.push({ id: crumb.id, name: crumb.name.trim(), slug: crumb.slug });
  }
  return result;
}

function sourceDate(value: unknown): string | null {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) ||
    !Number.isFinite(Date.parse(value))
  )
    return null;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const monthDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return month >= 1 && month <= 12 && day >= 1 && day <= monthDays ? value : null;
}

/** Invalid identity makes the response unavailable; missing optional facts never become demo values. */
export function mapProductDetails(product: ApiProductDetails): ProductDetails | null {
  const identity = mapProductIdentity(product);
  if (!identity) return null;
  return {
    ...identity,
    price:
      typeof product.price === 'number' && Number.isFinite(product.price) && product.price > 0
        ? product.price
        : null,
    inStock:
      typeof product.stock === 'number' && Number.isFinite(product.stock) && product.stock > 0,
    quantityInPack:
      Number.isSafeInteger(product.quantityInPack) && product.quantityInPack > 0
        ? product.quantityInPack
        : null,
    categoryName: typeof product.categoryName === 'string' ? product.categoryName.trim() : '',
    categorySlug: isValidProductSlug(product.categorySlug) ? product.categorySlug : null,
    breadcrumbs: mapBreadcrumbs(product.breadcrumbs),
    media: mapProductMedia(product.photos, product.photo, product.scheme),
    updatedAt: sourceDate(product.updatedAt),
  };
}
