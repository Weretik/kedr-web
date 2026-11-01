import {
  DEFAULT_LISTING_QUERY,
  hasListingFilters,
  isIndexableListing,
  listingHref,
  parseListingQuery,
  serializeListingQuery,
  withoutFilters,
} from './listing-query';

describe('listing query', () => {
  it('reads valid values and drops invalid ones', () => {
    expect(
      parseListingQuery({
        page: '3',
        sort: 'price-asc',
        inStock: 'true',
        isSale: '1',
        isNew: 'no',
        priceFrom: '100,4',
        priceTo: ' ',
        view: 'table',
      }),
    ).toEqual({
      page: 3,
      sort: 'price-asc',
      inStock: true,
      isSale: true,
      isNew: false,
      priceFrom: 100,
      priceTo: null,
      view: 'table',
    });

    expect(parseListingQuery({ page: '0', sort: 'cheap', view: 'list', priceFrom: '-1' })).toEqual(
      DEFAULT_LISTING_QUERY,
    );
    expect(parseListingQuery({ page: ['2', '5'] }).page).toBe(2);
  });

  it('swaps a reversed price range', () => {
    const query = parseListingQuery({ priceFrom: '900', priceTo: '100' });
    expect([query.priceFrom, query.priceTo]).toEqual([100, 900]);
  });

  it('serializes in a fixed order without defaults', () => {
    const query = { ...DEFAULT_LISTING_QUERY, page: 2, sort: 'new' as const, isNew: true };
    expect(serializeListingQuery(query)).toBe('isNew=true&sort=new&page=2');
    expect(serializeListingQuery(DEFAULT_LISTING_QUERY)).toBe('');
    expect(serializeListingQuery(DEFAULT_LISTING_QUERY, { q: 'agb 1' })).toBe('q=agb+1');
    expect(listingHref('/uk/catalog/zamky', DEFAULT_LISTING_QUERY)).toBe('/uk/catalog/zamky');
    expect(listingHref('/uk/catalog/zamky', query)).toBe(
      '/uk/catalog/zamky?isNew=true&sort=new&page=2',
    );
  });

  it('round-trips through the URL', () => {
    const query = parseListingQuery({ inStock: 'true', priceTo: '500', view: 'table', page: '4' });
    expect(
      parseListingQuery(Object.fromEntries(new URLSearchParams(serializeListingQuery(query)))),
    ).toEqual(query);
  });

  it('keeps only page numbers indexable', () => {
    expect(isIndexableListing({ ...DEFAULT_LISTING_QUERY, page: 5 })).toBe(true);
    expect(isIndexableListing({ ...DEFAULT_LISTING_QUERY, sort: 'name' })).toBe(false);
    expect(isIndexableListing({ ...DEFAULT_LISTING_QUERY, view: 'table' })).toBe(false);
  });

  it('resets filters but keeps sort and view', () => {
    const query = {
      ...DEFAULT_LISTING_QUERY,
      page: 3,
      inStock: true,
      sort: 'name' as const,
      view: 'table' as const,
    };
    expect(hasListingFilters(query)).toBe(true);
    expect(withoutFilters(query)).toEqual({
      ...DEFAULT_LISTING_QUERY,
      sort: 'name',
      view: 'table',
    });
    expect(hasListingFilters(withoutFilters(query))).toBe(false);
  });
});
