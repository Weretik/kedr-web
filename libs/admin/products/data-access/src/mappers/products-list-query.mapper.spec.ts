import { describe, expect, it } from 'vitest';

import { mapMissingPhotoQueryToApi, mapProductsListQueryToApi } from './products-list-query.mapper';

describe('products server query mapping', () => {
  it('preserves explicit false in the ordinary list', () => {
    expect(mapProductsListQueryToApi({
      page: 2, pageSize: 20, sort: 'name-asc',
      inStock: false, isSale: false, isNew: false, exportToSite: false,
    })).toMatchObject({
      page: 2, pageSize: 20, sort: 'NameAsc',
      inStock: false, isSale: false, isNew: false, exportToSite: false,
    });
  });

  it('sends search, sort and false filters to the missing-photo list', () => {
    expect(mapMissingPhotoQueryToApi({
      page: 1, pageSize: 10, sort: 'price-desc', searchTerm: 'кабель',
      inStock: false, exportToSite: false,
    })).toMatchObject({
      page: 1, pageSize: 10, sort: 'PriceDesc', searchTerm: 'кабель',
      inStock: false, exportToSite: false,
    });
  });

  it('sends category selection and category sort on both list endpoints', () => {
    expect(mapProductsListQueryToApi({ page: 1, pageSize: 20, sort: 'category-asc', categoryId: 42 }))
      .toMatchObject({ categoryId: 42, sort: 'CategoryAsc' });
    expect(mapMissingPhotoQueryToApi({ page: 1, pageSize: 20, sort: 'category-desc', categoryId: 42 }))
      .toMatchObject({ categoryId: 42, sort: 'CategoryDesc' });
  });
});
