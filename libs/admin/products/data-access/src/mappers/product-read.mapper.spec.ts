import { describe, expect, it } from 'vitest';

import { mapAdminProductDetailsResponse } from './product-read.mapper';

const item = {
  id: 7,
  nameUk: 'Кабель',
  nameRu: 'Кабель',
  productSlug: 'cable',
  photo: '',
  categoryId: 3,
  categoryName: 'Електрика',
  inStock: true,
  isSale: false,
  isNew: false,
  exportToSite: true,
  price: 25,
  stock: 8,
  quantityInPack: 2,
};

describe('product read mappers', () => {
  it('validates and maps admin detail fields', () => {
    expect(
      mapAdminProductDetailsResponse({
        ...item,
        scheme: '/scheme.jpg',
        categoryName: 'Електрика',
      }),
    ).toMatchObject({ id: 7, nameUk: 'Кабель', exportToSite: true, scheme: '/scheme.jpg' });
    expect(() => mapAdminProductDetailsResponse({ id: 7 })).toThrow();
  });
});
