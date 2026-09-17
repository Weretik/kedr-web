import { mapAdminProductPage } from './catalog-products.mapper';

describe('mapAdminProductPage', () => {
  it('maps transport fields to the catalog domain model', () => {
    expect(
      mapAdminProductPage({
        pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 2, totalRecords: 21 },
        value: [
          {
            id: 12,
            inStock: true,
            isNew: false,
            isSale: false,
            nameRu: 'Кабель',
            nameUk: 'Кабель',
            photo: '',
            price: 120.5,
            productSlug: 'kabel-12',
            exportToSite: true,
            stock: 4,
            quantityInPack: 1,
          },
        ],
      }),
    ).toEqual({
      items: [
        {
          availability: 'in_stock',
          id: '12',
          imageUrl: null,
          name: 'Кабель',
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
});
