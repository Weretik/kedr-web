import type { CatalogCategoryOption } from './catalog-category';

describe('CatalogCategoryOption', () => {
  it('supports a three-level category tree', () => {
    const categories: CatalogCategoryOption[] = [
      {
        children: [
          {
            children: [{ children: [], id: 3, label: 'USB-C' }],
            id: 2,
            label: 'Кабелі',
          },
        ],
        id: 1,
        label: 'Електрика',
      },
    ];

    expect(categories[0].children[0].children[0].label).toBe('USB-C');
  });
});
