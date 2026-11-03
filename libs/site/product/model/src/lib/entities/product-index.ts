/** Public list identity only: the index does not fetch a detail record for every URL. */
export type ProductIndexItem = { sku: string; slug: string; name: string };

export type ProductIndexFailureReason =
  'transport' | 'invalid-page' | 'inconsistent' | 'page-limit';

export type ProductIndexResult =
  | { kind: 'ok'; items: ProductIndexItem[] }
  | { kind: 'unavailable'; reason?: ProductIndexFailureReason };
