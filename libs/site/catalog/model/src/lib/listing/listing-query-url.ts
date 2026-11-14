import { DEFAULT_LISTING_QUERY } from './listing-query';

import type { ListingQuery } from './listing-query';

/** Adds or removes one attribute value, from page 1. */
export function toggleAttributeValue(
  query: ListingQuery,
  attribute: string,
  value: string,
): ListingQuery {
  const current = query.attributes[attribute] ?? [];
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value].sort();
  const attributes = { ...query.attributes };
  if (next.length) attributes[attribute] = next;
  else delete attributes[attribute];
  return { ...query, attributes, page: 1 };
}

/**
 * Query string without the leading `?`, in a fixed order and without default values, so equal choices give
 * one URL. Extra entries (the search term) come first.
 */
export function serializeListingQuery(
  query: ListingQuery,
  extra: Record<string, string> = {},
): string {
  const params = new URLSearchParams(extra);
  for (const key of Object.keys(query.attributes).sort()) {
    const values = query.attributes[key];
    if (values?.length) params.set(key, values.join(','));
  }
  if (query.inStock) params.set('inStock', 'true');
  if (query.isSale) params.set('isSale', 'true');
  if (query.isNew) params.set('isNew', 'true');
  if (query.priceFrom !== null) params.set('priceFrom', String(query.priceFrom));
  if (query.priceTo !== null) params.set('priceTo', String(query.priceTo));
  if (query.sort !== DEFAULT_LISTING_QUERY.sort) params.set('sort', query.sort);
  if (query.view !== DEFAULT_LISTING_QUERY.view) params.set('view', query.view);
  if (query.perPage !== DEFAULT_LISTING_QUERY.perPage) params.set('perPage', String(query.perPage));
  if (query.page !== 1) params.set('page', String(query.page));
  return params.toString();
}

/** Path with the serialized query, for links and navigation. */
export function listingHref(
  path: string,
  query: ListingQuery,
  extra: Record<string, string> = {},
): string {
  const search = serializeListingQuery(query, extra);
  return search ? `${path}?${search}` : path;
}

/** Only the plain list and its page numbers are indexable; filters, sort, view, and page size are not. */
export function isIndexableListing(query: ListingQuery): boolean {
  return serializeListingQuery({ ...query, page: 1 }) === '';
}

/** Whether any filter narrows the list (sort, view, page, and page size do not). */
export function hasListingFilters(query: ListingQuery): boolean {
  return (
    Object.keys(query.attributes).length > 0 ||
    query.inStock ||
    query.isSale ||
    query.isNew ||
    query.priceFrom !== null ||
    query.priceTo !== null
  );
}

/** The same choices without filters, from page 1: the reset target of an empty result. */
export function withoutFilters(query: ListingQuery): ListingQuery {
  return {
    ...DEFAULT_LISTING_QUERY,
    sort: query.sort,
    view: query.view,
    perPage: query.perPage,
  };
}
