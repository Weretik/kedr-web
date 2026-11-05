import {
  countAttributeChoices,
  parseAttributeChoices,
  serializeAttributeChoices,
  toggleAttributeChoice,
} from './attribute-choices';

import type { AttributeChoices } from './attribute-choices';

/** Sort orders offered on listings; `availability` (in stock first, then by name) is the default. */
export const LISTING_SORTS = ['availability', 'price-asc', 'price-desc', 'new', 'name'] as const;
export type ListingSort = (typeof LISTING_SORTS)[number];

export const LISTING_VIEWS = ['grid', 'table'] as const;
export type ListingView = (typeof LISTING_VIEWS)[number];

/** Products per page the visitor can choose; 50 is the default (owner decision 2026-11-01). */
export const LISTING_PAGE_SIZES = [20, 50, 100] as const;
export type ListingPageSize = (typeof LISTING_PAGE_SIZES)[number];

/** Visitor choices on a listing. The URL keeps only values that differ from `DEFAULT_LISTING_QUERY`. */
export type ListingQuery = {
  page: number;
  sort: ListingSort;
  inStock: boolean;
  isSale: boolean;
  isNew: boolean;
  priceFrom: number | null;
  priceTo: number | null;
  view: ListingView;
  perPage: ListingPageSize;
  /** Category attribute filters; the URL keeps each as its own key, for example `?kolir=khrom,chornyi`. */
  attributes: AttributeChoices;
};

export const DEFAULT_LISTING_QUERY: ListingQuery = {
  page: 1,
  sort: 'availability',
  inStock: false,
  isSale: false,
  isNew: false,
  priceFrom: null,
  priceTo: null,
  view: 'grid',
  perPage: 20,
  attributes: {},
};

/** URL keys that are not attribute filters: the listing choices and the search term. */
const RESERVED_KEYS: ReadonlySet<string> = new Set([
  'page',
  'sort',
  'inStock',
  'isSale',
  'isNew',
  'priceFrom',
  'priceTo',
  'view',
  'perPage',
  'q',
]);

/** Shape of Next.js `searchParams` and of `URLSearchParams` entries. */
export type SearchParamsRecord = Record<string, string | string[] | undefined>;

const MAX_PAGE = 10_000;
const MAX_PRICE = 10_000_000;

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const parseFlag = (value: string | undefined) => value === 'true' || value === '1';

const parsePage = (value: string | undefined): number => {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= MAX_PAGE ? page : 1;
};

const parsePrice = (value: string | undefined): number | null => {
  if (value === undefined || value.trim() === '') return null;
  const price = Number(value.replace(',', '.'));
  return Number.isFinite(price) && price >= 0 && price <= MAX_PRICE ? Math.round(price) : null;
};

const parsePerPage = (value: string | undefined): ListingPageSize => {
  const size = Number(value);
  return LISTING_PAGE_SIZES.includes(size as ListingPageSize)
    ? (size as ListingPageSize)
    : DEFAULT_LISTING_QUERY.perPage;
};

const pick = <T extends string>(values: readonly T[], value: string | undefined, fallback: T): T =>
  values.includes(value as T) ? (value as T) : fallback;

/** Reads listing choices from the URL; unknown or invalid values fall back to the defaults. */
export function parseListingQuery(params: SearchParamsRecord): ListingQuery {
  let priceFrom = parsePrice(first(params['priceFrom']));
  let priceTo = parsePrice(first(params['priceTo']));
  if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
    [priceFrom, priceTo] = [priceTo, priceFrom];
  }

  return {
    page: parsePage(first(params['page'])),
    sort: pick(LISTING_SORTS, first(params['sort']), DEFAULT_LISTING_QUERY.sort),
    inStock: parseFlag(first(params['inStock'])),
    isSale: parseFlag(first(params['isSale'])),
    isNew: parseFlag(first(params['isNew'])),
    priceFrom,
    priceTo,
    view: pick(LISTING_VIEWS, first(params['view']), DEFAULT_LISTING_QUERY.view),
    perPage: parsePerPage(first(params['perPage'])),
    attributes: parseAttributeChoices(params, RESERVED_KEYS),
  };
}

/**
 * Query string without the leading `?`, in a fixed order and without default values, so equal choices give
 * one URL. Attribute filters come first (sorted, with readable commas), then extra entries (the search term).
 */
export function serializeListingQuery(
  query: ListingQuery,
  extra: Record<string, string> = {},
): string {
  const params = new URLSearchParams(extra);
  if (query.inStock) params.set('inStock', 'true');
  if (query.isSale) params.set('isSale', 'true');
  if (query.isNew) params.set('isNew', 'true');
  if (query.priceFrom !== null) params.set('priceFrom', String(query.priceFrom));
  if (query.priceTo !== null) params.set('priceTo', String(query.priceTo));
  if (query.sort !== DEFAULT_LISTING_QUERY.sort) params.set('sort', query.sort);
  if (query.view !== DEFAULT_LISTING_QUERY.view) params.set('view', query.view);
  if (query.perPage !== DEFAULT_LISTING_QUERY.perPage) params.set('perPage', String(query.perPage));
  if (query.page !== 1) params.set('page', String(query.page));
  return [serializeAttributeChoices(query.attributes), params.toString()].filter(Boolean).join('&');
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
    query.inStock ||
    query.isSale ||
    query.isNew ||
    query.priceFrom !== null ||
    query.priceTo !== null ||
    countAttributeChoices(query.attributes) > 0
  );
}

/** Adds or removes one attribute value, from page 1. */
export function toggleAttribute(query: ListingQuery, key: string, value: string): ListingQuery {
  return { ...query, attributes: toggleAttributeChoice(query.attributes, key, value), page: 1 };
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
