import { toCatalogProductsParams } from './catalog-query.mapper';

describe('toCatalogProductsParams', () => {
  it('omits an empty search and serializes documented parameters', () => {
    expect(
      toCatalogProductsParams({
        filters: { inStock: false, priceTo: 500 },
        page: 2,
        search: '   ',
        sort: 'PriceAsc',
      }),
    ).toEqual({ inStock: false, page: 2, pageSize: 20, priceTo: 500, sort: 'PriceAsc' });
  });
});
