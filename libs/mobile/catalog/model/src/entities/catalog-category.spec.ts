import { findCatalogCategoryPath, type CatalogCategoryOption } from './catalog-category';

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

  it('finds the path to a nested category', () => {
    const categories: CatalogCategoryOption[] = [
      { children: [{ children: [], id: 2, label: 'Кабелі' }], id: 1, label: 'Електрика' },
    ];

    expect(findCatalogCategoryPath(categories, 2)).toEqual([
      { id: 1, label: 'Електрика' },
      { id: 2, label: 'Кабелі' },
    ]);
    expect(findCatalogCategoryPath(categories, 9)).toBeUndefined();
    expect(findCatalogCategoryPath(categories, undefined)).toBeUndefined();
  });
});
