import { describe, expect, it } from 'vitest';

import { mapAdminProductsListResponse } from './admin-products-list.mapper';

const item = {
  id: 1,
  nameUk: 'Ручка',
  nameRu: 'Ручка',
  productSlug: 'ruchka',
  photo: '',
  categoryId: null,
  categoryName: 'Без категорії',
  inStock: true,
  isSale: false,
  isNew: false,
  exportToSite: true,
  stock: 3,
  quantityInPack: 1,
};
const pagedInfo = { pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 1 };

describe('admin products list mapper', () => {
  it('maps a page and fills the missing price and deletion date with null', () => {
    const page = mapAdminProductsListResponse({ pagedInfo, value: [item] });
    expect(page.totalRecords).toBe(1);
    expect(page.items[0]).toMatchObject({ id: 1, price: null, deletedAt: null, categoryId: null });
  });

  it('rejects a row with a negative pack size', () => {
    expect(() =>
      mapAdminProductsListResponse({ pagedInfo, value: [{ ...item, quantityInPack: -1 }] }),
    ).toThrow();
  });
});
