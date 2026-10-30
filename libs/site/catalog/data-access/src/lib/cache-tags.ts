/** Cache tags for catalog data; a backend import event revalidates `catalog`, which covers every entry. */
export const CATALOG_CACHE_TAGS = {
  all: 'catalog',
  categories: 'catalog:categories',
  products: 'catalog:products',
} as const;
