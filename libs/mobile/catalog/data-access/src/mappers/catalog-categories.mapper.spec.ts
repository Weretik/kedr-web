import { mapAdminCategories } from './catalog-categories.mapper';

import type { AdminCategoryDto } from '../contracts/admin-categories.dto';

const category = (overrides: Partial<AdminCategoryDto>): AdminCategoryDto => ({
  id: 1,
  level: 0,
  name: 'Категорія',
  parentId: null,
  productTypeIdOneC: '1',
  shortNameRu: 'Категория',
  shortNameUk: 'Категорія',
  slug: 'category-1',
  sortOrder: 0,
  ...overrides,
});

describe('mapAdminCategories', () => {
  it('maps a sorted three-level tree with Ukrainian labels', () => {
    expect(
      mapAdminCategories([
        category({ id: 3, level: 1, parentId: 1, shortNameUk: 'Дочірня 2', sortOrder: 1 }),
        category({ id: 1, shortNameUk: 'Корінь', sortOrder: 1 }),
        category({ id: 4, level: 2, parentId: 2, shortNameUk: 'Третій рівень' }),
        category({ id: 2, level: 1, parentId: 1, shortNameUk: 'Дочірня 1', sortOrder: 0 }),
        category({ id: 5, shortNameUk: 'Перший корінь', sortOrder: 0 }),
      ]),
    ).toEqual([
      { children: [], id: 5, label: 'Перший корінь' },
      {
        children: [
          {
            children: [{ children: [], id: 4, label: 'Третій рівень' }],
            id: 2,
            label: 'Дочірня 1',
          },
          { children: [], id: 3, label: 'Дочірня 2' },
        ],
        id: 1,
        label: 'Корінь',
      },
    ]);
  });

  it('falls back to the Russian short name only when the Ukrainian name is unavailable', () => {
    expect(mapAdminCategories([category({ shortNameUk: '   ', shortNameRu: 'Петли' })])).toEqual([
      { children: [], id: 1, label: 'Петли' },
    ]);
  });

  it('omits malformed, orphaned, cyclic, and deeper-than-three-level rows', () => {
    expect(
      mapAdminCategories([
        category({ id: 1, shortNameUk: 'Корінь' }),
        category({ id: 2, level: 1, parentId: 1, shortNameUk: 'Валідна' }),
        category({ id: 3, level: 3, parentId: 2, shortNameUk: 'Занадто глибока' }),
        category({ id: 4, level: 1, parentId: 999, shortNameUk: 'Сирота' }),
        category({ id: 5, level: 1, parentId: 6, shortNameUk: 'Цикл 1' }),
        category({ id: 6, level: 1, parentId: 5, shortNameUk: 'Цикл 2' }),
        category({ id: 7, level: 2, parentId: 1, shortNameUk: 'Невірний рівень' }),
        category({ id: 8, shortNameUk: 'Дублікат' }),
        category({ id: 8, shortNameUk: 'Ще дублікат' }),
      ]),
    ).toEqual([{ children: [{ children: [], id: 2, label: 'Валідна' }], id: 1, label: 'Корінь' }]);
  });
});
