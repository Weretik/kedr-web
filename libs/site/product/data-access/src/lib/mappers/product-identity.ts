import { isValidProductSlug } from '@site/product/model';

import type { ApiProductIdentity } from '../contracts/product.dto';
import type { ProductIndexItem } from '@site/product/model';

/** Shared identity validation for a detail record and list rows from the same provider. */
export function mapProductIdentity(value: unknown): ProductIndexItem | null {
  if (typeof value !== 'object' || value === null) return null;
  const product = value as Partial<ApiProductIdentity>;
  if (!Number.isSafeInteger(product.id) || (product.id as number) <= 0) return null;
  if (typeof product.name !== 'string' || !product.name.trim()) return null;
  if (!isValidProductSlug(product.productSlug)) return null;
  return { sku: String(product.id), slug: product.productSlug, name: product.name.trim() };
}
