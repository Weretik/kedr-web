import type { CatalogQuery } from './catalog-query';

export const catalogSearchMaxLength = 100;

export function withCatalogSearch(query: CatalogQuery, search: string): CatalogQuery {
  return {
    ...query,
    page: 1,
    search: search.slice(0, catalogSearchMaxLength),
  };
}
