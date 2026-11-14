import { describe, expect, it } from 'vitest';

import { childCategoriesOf, descendantCount, expandableCategoryIds } from './category-family';
import { buildCategoryTree } from './category-tree-nodes';

import type { AdminCategory } from '../entities/admin-category';

const category = (id: number, parentId: number | null, sortOrder = 0) =>
  ({
    id,
    parentId,
    sortOrder,
    nameUk: `К${id}`,
    nameRu: `К${id}`,
    slug: `k${id}`,
  }) as AdminCategory;

const rows = [
  category(1, null),
  category(2, 1, 2),
  category(3, 1, 1),
  category(4, 2),
  category(5, null),
];
const byId = new Map(rows.map((row) => [row.id, row]));

describe('category family', () => {
  it('lists the ids of every category that has children', () => {
    expect(expandableCategoryIds(buildCategoryTree(rows))).toEqual(['1', '2']);
  });

  it('counts all descendants, not only direct children', () => {
    expect(descendantCount(rows, 1, byId)).toBe(3);
    expect(descendantCount(rows, 5, byId)).toBe(0);
  });

  it('returns direct children in display order', () => {
    expect(childCategoriesOf(rows, 1).map((row) => row.id)).toEqual([3, 2]);
  });
});
