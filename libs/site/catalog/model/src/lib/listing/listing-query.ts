/** Sort orders offered on listings; `availability` (in stock first, then by name) is the default. */
export const LISTING_SORTS = ['availability', 'price-asc', 'price-desc', 'new', 'name'] as const;
export type ListingSort = (typeof LISTING_SORTS)[number];

export const LISTING_VIEWS = ['grid', 'table'] as const;
export type ListingView = (typeof LISTING_VIEWS)[number];

/** Products per page the visitor can choose; 50 is the default (owner decision 2026-11-01). */
export const LISTING_PAGE_SIZES = [20, 50, 100] as const;
export type ListingPageSize = (typeof LISTING_PAGE_SIZES)[number];

/** Attribute filter choices: attribute slug → value slugs, both sorted, so equal choices give one URL. */
export type ListingAttributes = Readonly<Record<string, readonly string[]>>;

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
  /** Attribute filters of a final category (`?kolir=khrom,bronza`). */
  attributes: ListingAttributes;
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

/** Query keys that are listing choices or the search term; every other slug-like key is an attribute filter. */
const RESERVED_KEYS = new Set([
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
const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;
const MAX_ATTRIBUTES = 10;
const MAX_VALUES = 50;

/** Attribute filters from the URL: slug keys with comma-separated slug values; anything else is ignored. */
const parseAttributes = (params: SearchParamsRecord): ListingAttributes => {
  const attributes: Record<string, string[]> = {};
  let values = 0;
  for (const key of Object.keys(params).sort()) {
    if (RESERVED_KEYS.has(key) || !SLUG.test(key)) continue;
    if (Object.keys(attributes).length >= MAX_ATTRIBUTES) break;
    const raw = params[key];
    const chosen = [
      ...new Set(
        (Array.isArray(raw) ? raw : [raw])
          .flatMap((value) => (value ?? '').split(','))
          .map((value) => value.trim())
          .filter((value) => SLUG.test(value)),
      ),
    ]
      .sort()
      .slice(0, MAX_VALUES - values);
    if (!chosen.length) continue;
    attributes[key] = chosen;
    values += chosen.length;
  }
  return attributes;
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
    attributes: parseAttributes(params),
  };
}
