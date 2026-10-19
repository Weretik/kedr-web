import { describe, expect, it } from 'vitest';

import { mapAdminProductDetailsResponse, mapMissingPhotoProductsResponse } from './product-read.mapper';

const item = {
  id: 7, nameUk: 'Кабель', nameRu: 'Кабель', productSlug: 'cable', photo: '',
  categoryId: 3, categoryName: 'Електрика', inStock: true, isSale: false, isNew: false, exportToSite: true,
  price: 25, stock: 8, quantityInPack: 2, photoAvailable: false,
  photoStatus: 'Missing', photoCheckedAtUtc: '2026-10-19T10:00:00Z', photoHttpStatusCode: 404,
};

describe('product read mappers', () => {
  it('maps the server-owned missing-photo page without exposing diagnostics', () => {
    expect(mapMissingPhotoProductsResponse({
      pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 1 },
      value: [item],
    })).toMatchObject({ items: [{ id: 7, productSlug: 'cable' }], totalRecords: 1 });
  });

  it('rejects malformed missing-photo membership', () => {
    expect(() => mapMissingPhotoProductsResponse({
      pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 1 },
      value: [{ ...item, photoAvailable: true }],
    })).toThrow();
  });

  it('maps omitted optional category and price to null', () => {
    const withoutOptionals = Object.fromEntries(
      Object.entries(item).filter(([key]) => key !== 'categoryId' && key !== 'price'),
    );
    expect(mapMissingPhotoProductsResponse({
      pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 1 },
      value: [withoutOptionals],
    }).items[0]).toMatchObject({ categoryId: null, price: null });
  });

  it('validates and maps admin detail fields', () => {
    expect(mapAdminProductDetailsResponse({
      ...item, scheme: '/scheme.jpg', categoryName: 'Електрика',
    })).toMatchObject({ id: 7, nameUk: 'Кабель', exportToSite: true, scheme: '/scheme.jpg' });
    expect(() => mapAdminProductDetailsResponse({ id: 7 })).toThrow();
  });
});
