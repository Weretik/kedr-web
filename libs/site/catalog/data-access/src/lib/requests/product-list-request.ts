import type { operations } from '@shared/api-contracts';
import type { ListingQuery, ListingSort } from '@site/catalog/model';

type CategoryModelsQuery = NonNullable<
  operations['getPublicCategorySiteModels']['parameters']['query']
>;
type ModelSort = NonNullable<CategoryModelsQuery['sort']>;

const API_SORT: Record<ListingSort, ModelSort> = {
  availability: 'default',
  'price-asc': 'price_asc',
  'price-desc': 'price_desc',
  new: 'new',
  name: 'name_asc',
};

/** What a listing asks for besides the visitor's choices: one category subtree or a search term. */
export type ProductListScope = { categorySlug: string } | { searchTerm: string };

/**
 * API query of the site models list for one listing page; the view does not reach the API. Attribute filters
 * go only to a category (`attribute:value,value`); the search takes none.
 */
export function toProductListRequest(
  scope: ProductListScope,
  query: ListingQuery,
): CategoryModelsQuery {
  const filter =
    'categorySlug' in scope
      ? Object.entries(query.attributes).map(([slug, values]) => `${slug}:${values.join(',')}`)
      : [];
  return {
    ...('searchTerm' in scope ? { search: scope.searchTerm } : {}),
    ...(filter.length ? { filter } : {}),
    inStock: query.inStock || undefined,
    isSale: query.isSale || undefined,
    isNew: query.isNew || undefined,
    priceFrom: query.priceFrom ?? undefined,
    priceTo: query.priceTo ?? undefined,
    sort: API_SORT[query.sort],
    page: query.page,
    pageSize: query.perPage,
  };
}
