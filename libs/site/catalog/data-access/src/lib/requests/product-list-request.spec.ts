import { DEFAULT_LISTING_QUERY } from '@site/catalog/model';

import { toProductListRequest } from './product-list-request';

describe('toProductListRequest', () => {
  it('asks for in-stock models first by default', () => {
    expect(toProductListRequest({ categorySlug: 'zavisy' }, DEFAULT_LISTING_QUERY)).toEqual({
      inStock: undefined,
      isSale: undefined,
      isNew: undefined,
      priceFrom: undefined,
      priceTo: undefined,
      sort: 'default',
      page: 1,
      pageSize: 20,
    });
  });

  it('passes the visitor filters, sort, and page; the search takes no attribute filters', () => {
    const query = {
      ...DEFAULT_LISTING_QUERY,
      inStock: true,
      isSale: true,
      isNew: true,
      priceFrom: 100,
      priceTo: 500,
      sort: 'price-desc' as const,
      page: 3,
      view: 'table' as const,
      attributes: { kolir: ['khrom'], storona: ['liva', 'prava'] },
    };

    expect(toProductListRequest({ searchTerm: 'завіса' }, query)).toEqual({
      search: 'завіса',
      inStock: true,
      isSale: true,
      isNew: true,
      priceFrom: 100,
      priceTo: 500,
      sort: 'price_desc',
      page: 3,
      pageSize: 20,
    });
    expect(toProductListRequest({ categorySlug: 'zavisy' }, query).filter).toEqual([
      'kolir:khrom',
      'storona:liva,prava',
    ]);
  });
});
