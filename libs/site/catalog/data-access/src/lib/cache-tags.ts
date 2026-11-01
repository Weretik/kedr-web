/** Cache tags for catalog data; a backend import event revalidates `catalog`, which covers every entry. */
export const CATALOG_CACHE_TAGS = {
  all: 'catalog',
  categories: 'catalog:categories',
  products: 'catalog:products',
  category: (slug: string) => `category:${slug}`,
} as const;

// A failed read is cached briefly and retried in the background, but still prerendered (expire ≥ 5 minutes).
export const FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3600 };
