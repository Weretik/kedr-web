import type { operations } from '@shared/api-contracts';
import type { ListingQuery, ListingSort } from '@site/catalog/model';

type PublicProductsQuery = NonNullable<operations['getPublicProducts']['parameters']['query']>;

const API_SORT: Record<ListingSort, NonNullable<PublicProductsQuery['sort']>> = {
  availability: 'AvailabilityThenName',
  'price-asc': 'PriceAsc',
  'price-desc': 'PriceDesc',
  new: 'IdDesc',
  name: 'NameAsc',
};

/** What a listing asks for besides the visitor's choices: one category subtree or a search term. */
export type ProductListScope = { categoryId: number } | { searchTerm: string };

/** API query of `getPublicProducts` for one listing page; the view does not reach the API. */
export function toProductListRequest(
  scope: ProductListScope,
  query: ListingQuery,
): PublicProductsQuery {
  return {
    ...scope,
    availability: query.inStock ? 'InStock' : 'All',
    isSale: query.isSale || undefined,
    isNew: query.isNew || undefined,
    priceFrom: query.priceFrom ?? undefined,
    priceTo: query.priceTo ?? undefined,
    sort: API_SORT[query.sort],
    page: query.page,
    pageSize: query.perPage,
  };
}
