import { mapMissingPhotoProductPage } from './missing-photo-products.mapper';

const response = {
  pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 2, totalRecords: 21 },
  value: [
    {
      categoryId: null,
      categoryName: '',
      exportToSite: true,
      id: 12,
      inStock: true,
      isNew: false,
      isSale: false,
      nameRu: 'Кабель',
      nameUk: 'Кабель українською',
      photo: 'https://cdn.invalid/missing.jpg',
      photoAvailable: false,
      photoCheckedAtUtc: '2026-10-05T09:30:00Z',
      photoHttpStatusCode: 404,
      photoStatus: 'Missing',
      price: 120.5,
      productSlug: 'kabel-12',
      quantityInPack: 1,
      stock: 4,
    },
  ],
};

describe('mapMissingPhotoProductPage', () => {
  it('maps every authoritative result without rechecking photo fields', () => {
    expect(mapMissingPhotoProductPage(response)).toEqual({
      items: [
        {
          availability: 'in_stock',
          id: '12',
          imageUrl: null,
          name: 'Кабель українською',
          price: 120.5,
          productSlug: 'kabel-12',
        },
      ],
      pageNumber: 1,
      pageSize: 20,
      totalPages: 2,
      totalRecords: 21,
    });
  });

  it('maps an empty successful response', () => {
    expect(
      mapMissingPhotoProductPage({
        ...response,
        pagedInfo: { ...response.pagedInfo, totalPages: 0, totalRecords: 0 },
        value: [],
      }).items,
    ).toEqual([]);
  });

  it('rejects a response that contradicts the generated transport shape', () => {
    expect(() =>
      mapMissingPhotoProductPage({
        ...response,
        value: [{ ...response.value[0], photoAvailable: true }],
      }),
    ).toThrow();
  });

  it('rejects fractional values for OpenAPI integer fields', () => {
    expect(() =>
      mapMissingPhotoProductPage({
        ...response,
        value: [{ ...response.value[0], id: 12.5 }],
      }),
    ).toThrow();
  });

  it('accepts the UTC offset emitted by the backend DateTimeOffset field', () => {
    expect(
      mapMissingPhotoProductPage({
        ...response,
        value: [
          {
            ...response.value[0],
            photoCheckedAtUtc: '2026-09-23T12:00:00.0000000+00:00',
          },
        ],
      }).items,
    ).toHaveLength(1);
  });
});
