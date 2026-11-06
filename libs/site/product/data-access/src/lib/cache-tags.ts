/** Shared catalog invalidation also refreshes every public product read. */
export const PRODUCT_CACHE_TAGS = {
  all: 'catalog',
  products: 'catalog:products',
  index: 'catalog:products:index',
  models: 'catalog:models',
  product: (sku: string) => 'product:' + sku,
  // The complete slug is still a cache key. Bound tags to Next's 256-character limit.
  slug: (slug: string) => 'product:slug:' + slug.slice(0, 200),
} as const;

export const PRODUCT_FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3600 };
