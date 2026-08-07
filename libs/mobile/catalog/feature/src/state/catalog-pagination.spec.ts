import { mergeCatalogProducts } from './catalog-pagination';

describe('mergeCatalogProducts', () => {
  it('deduplicates products by id while preserving their latest value', () => {
    expect(
      mergeCatalogProducts(
        [
          {
            availability: 'in_stock',
            id: '1',
            imageUrl: null,
            name: 'Старий',
            price: 1,
            productSlug: 'one',
          },
        ],
        [
          {
            availability: 'out_of_stock',
            id: '1',
            imageUrl: null,
            name: 'Оновлений',
            price: 2,
            productSlug: 'one',
          },
          {
            availability: 'in_stock',
            id: '2',
            imageUrl: null,
            name: 'Новий',
            price: null,
            productSlug: 'two',
          },
        ],
      ),
    ).toEqual([
      {
        availability: 'out_of_stock',
        id: '1',
        imageUrl: null,
        name: 'Оновлений',
        price: 2,
        productSlug: 'one',
      },
      {
        availability: 'in_stock',
        id: '2',
        imageUrl: null,
        name: 'Новий',
        price: null,
        productSlug: 'two',
      },
    ]);
  });
});
