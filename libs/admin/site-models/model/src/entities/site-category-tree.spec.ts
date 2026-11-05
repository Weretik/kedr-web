import { describe, expect, it } from 'vitest';

import { isFinalSiteCategory, siteCategoryAncestors, siteCategoryTree } from './site-category-tree';

import type { SiteModelCategory } from './site-showcase';

const category = (id: number, parentId: number | null): SiteModelCategory => ({
  id,
  name: `Категорія ${id}`,
  parentId,
  onSiteProducts: 1,
  acceptedModels: 0,
  proposedModels: 0,
  problemCount: 0,
});

describe('site category tree', () => {
  const list = [category(1, null), category(2, 1), category(3, 2), category(4, 99)];

  it('nests categories and lifts one whose parent is missing to the top', () => {
    const tree = siteCategoryTree(list);
    expect(tree.map((node) => node.category.id)).toEqual([1, 4]);
    expect(tree[0].children[0].children[0].category.id).toBe(3);
  });

  it('finds the ancestors and final categories', () => {
    expect(siteCategoryAncestors(list, 3)).toEqual([2, 1]);
    expect(siteCategoryAncestors(list, undefined)).toEqual([]);
    expect(isFinalSiteCategory(list, 3)).toBe(true);
    expect(isFinalSiteCategory(list, 1)).toBe(false);
  });
});
