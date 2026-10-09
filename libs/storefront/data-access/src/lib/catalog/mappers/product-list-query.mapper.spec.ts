import { ProductSort } from '@storefront/contracts';

import { mapProductListQueryToApi, mapSortUiToApi } from './product-list-query.mapper';

describe('product list query mapper', () => {
  it('normalizes valid filter values for the transport contract', () => {
    expect(
      mapProductListQueryToApi({
        search: '  cedar oil  ',
        inStock: 'true',
        isSale: 'false',
        isNew: undefined,
        priceFrom: '12.50',
        priceTo: 'invalid',
        sort: 'price-desc',
        page: '2',
        pageSize: '24',
      }),
    ).toEqual({
      searchTerm: 'cedar oil',
      inStock: true,
      isSale: false,
      isNew: undefined,
      priceFrom: 12.5,
      priceTo: undefined,
      sort: ProductSort.PriceDesc,
      page: 2,
      pageSize: 24,
    });
  });

  it('keeps the current defaults for absent or malformed pagination', () => {
    expect(
      mapProductListQueryToApi({
        search: undefined,
        inStock: undefined,
        isSale: undefined,
        isNew: undefined,
        priceFrom: undefined,
        priceTo: undefined,
        sort: 'id-asc',
        page: '1.5',
        pageSize: '',
      }),
    ).toMatchObject({ page: 1, pageSize: 50 });
    expect(mapSortUiToApi(undefined)).toBeUndefined();
  });
});
