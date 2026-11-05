import { describe, expect, it } from 'vitest';

import {
  countFinalWithoutFilters,
  filterCategoryTree,
  findFilterCategory,
  moveFilter,
} from './category-filter';

import type { CategoryFilter } from './category-filter';

describe('category filters', () => {
  const tree = filterCategoryTree([
    { id: 1, name: 'Фурнітура', parentId: null, filterCount: 0 },
    { id: 2, name: 'Замки', parentId: 1, filterCount: 0 },
    { id: 3, name: 'Сувальдні', parentId: 2, filterCount: 5 },
    { id: 4, name: 'Накладні', parentId: 2, filterCount: 0 },
    { id: 5, name: 'Ручки', parentId: 1, filterCount: 0 },
  ]);

  it('builds the tree with full paths', () => {
    expect(findFilterCategory(tree, 3)?.path).toBe('Фурнітура › Замки › Сувальдні');
    expect(findFilterCategory(tree, 9)).toBeUndefined();
  });

  it('counts only final categories without filters', () => {
    expect(countFinalWithoutFilters(tree)).toBe(2);
  });

  it('moves a filter and renumbers the order', () => {
    const filter = (attributeId: number): CategoryFilter => ({
      attributeId,
      code: `a${attributeId}`,
      name: `A${attributeId}`,
      isFilterable: true,
      sortOrder: attributeId,
      isEditedManually: false,
      productCount: 1,
    });
    expect(
      moveFilter([filter(1), filter(2)], 1, -1).map((item) => [item.attributeId, item.sortOrder]),
    ).toEqual([
      [2, 10],
      [1, 20],
    ]);
  });
});
