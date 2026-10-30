import { describe, expect, it } from 'vitest';

import { categoryPath, orderCategoryTree } from './category-tree-order';

import type { AdminCategory } from '../entities/admin-category';

const category = (overrides: Partial<AdminCategory>): AdminCategory => ({
  deletedAt: null,
  id: 1,
  isDeleted: false,
  level: 0,
  nameRu: '',
  nameUk: 'Категорія',
  parentId: null,
  slug: 'category',
  sortOrder: 0,
  sourceKey: '1',
  sourceName: '',
  ...overrides,
});

describe('orderCategoryTree', () => {
  it('puts children after their parent in sort order and keeps orphans', () => {
    const ordered = orderCategoryTree([
      category({ id: 3, parentId: 1, sortOrder: 1 }),
      category({ id: 2, parentId: 1, sortOrder: 0 }),
      category({ id: 1 }),
      category({ id: 4, parentId: 99 }),
    ]);

    expect(ordered.map((row) => row.id)).toEqual([1, 2, 3, 4]);
  });
});

describe('categoryPath', () => {
  it('lists names from the root', () => {
    const root = category({ id: 1, nameUk: 'Фурнітура' });
    const child = category({ id: 2, nameUk: 'Завіси', parentId: 1 });

    expect(
      categoryPath(
        child,
        new Map([
          [1, root],
          [2, child],
        ]),
      ),
    ).toEqual(['Фурнітура', 'Завіси']);
  });
});
