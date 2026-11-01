import { DEFAULT_LISTING_QUERY } from '@site/catalog/model';

import { toProductListRequest } from './product-list-request';

describe('toProductListRequest', () => {
  it('asks for in-stock products first by default', () => {
    expect(toProductListRequest({ categoryId: 9 }, DEFAULT_LISTING_QUERY)).toEqual({
      categoryId: 9,
      availability: 'All',
      isSale: undefined,
      isNew: undefined,
      priceFrom: undefined,
      priceTo: undefined,
      sort: 'AvailabilityThenName',
      page: 1,
      pageSize: 24,
    });
  });

  it('passes the visitor filters, sort, and page', () => {
    const request = toProductListRequest(
      { searchTerm: 'завіса' },
      {
        ...DEFAULT_LISTING_QUERY,
        inStock: true,
        isSale: true,
        isNew: true,
        priceFrom: 100,
        priceTo: 500,
        sort: 'price-desc',
        page: 3,
        view: 'table',
      },
    );

    expect(request).toEqual({
      searchTerm: 'завіса',
      availability: 'InStock',
      isSale: true,
      isNew: true,
      priceFrom: 100,
      priceTo: 500,
      sort: 'PriceDesc',
      page: 3,
      pageSize: 24,
    });
  });
});
