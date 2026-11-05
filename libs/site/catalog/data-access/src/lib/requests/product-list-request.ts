import { toAttributeFilter } from '@site/catalog/model';

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

/**
 * API query of `getPublicProducts` for one listing page; the view does not reach the API. A category listing shows
 * one card per variant group and takes the attribute filters (spec catalog/006); a search lists every product.
 */
export function toProductListRequest(
  scope: ProductListScope,
  query: ListingQuery,
): PublicProductsQuery {
  const filter = toAttributeFilter(query.attributes);
  return {
    ...scope,
    ...('categoryId' in scope && {
      groupVariants: true,
      filter: filter.length ? filter : undefined,
    }),
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

type FacetsQuery = NonNullable<operations['getCategoryFacets']['parameters']['query']>;

/** API query of `getCategoryFacets`: the same narrowing as the list; sort, page, and view do not matter. */
export function toFacetsRequest(query: ListingQuery): FacetsQuery {
  const filter = toAttributeFilter(query.attributes);
  return {
    availability: query.inStock ? 'InStock' : 'All',
    isSale: query.isSale || undefined,
    isNew: query.isNew || undefined,
    priceFrom: query.priceFrom ?? undefined,
    priceTo: query.priceTo ?? undefined,
    filter: filter.length ? filter : undefined,
  };
}
