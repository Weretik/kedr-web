/** Public list identity only: the index does not fetch a detail record for every URL. */
export type ProductIndexItem = {
  sku: string;
  slug: string;
  name: string;
  /** The model's category, to keep models of categories closed from search out of the sitemap. Models only. */
  categorySlug?: string;
  /** The model's last change in this language, for `lastmod`. Models only. */
  updatedAt?: string;
};

export type ProductIndexFailureReason =
  'transport' | 'invalid-page' | 'inconsistent' | 'page-limit';

export type ProductIndexResult =
  | { kind: 'ok'; items: ProductIndexItem[] }
  | { kind: 'unavailable'; reason?: ProductIndexFailureReason };
