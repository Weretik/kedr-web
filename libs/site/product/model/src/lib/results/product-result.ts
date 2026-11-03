import type { ProductDetails } from '../entities/product-details';

export type ProductResult =
  | { kind: 'ok'; product: ProductDetails }
  | { kind: 'moved'; slug: string; product: ProductDetails }
  | { kind: 'category-redirect'; slug: string }
  | { kind: 'not-found' }
  | { kind: 'unavailable' };
