import { describe, expect, it } from 'vitest';

import { categoryTableRows, parentCategoryIds } from './category-table-rows';
import { buildCategoryTree } from './category-tree-nodes';

import type { AdminCategory } from '../../entities/admin-category';

const category = (id: number, parentId: number | null, nameUk: string): AdminCategory => ({
  deletedAt: null,
  id,
  isDeleted: false,
  isShownOnSite: true,
  level: 0,
  nameRu: nameUk,
  nameUk,
  parentId,
  slug: `c-${id}`,
  sortOrder: id,
  sourceKey: '1',
  sourceName: nameUk,
  productCount: 0,
  filledLanguages: [],
  siteNameUk: null,
  siteNameRu: null,
  isClosedFromSearch: false,
  sharePicture: null,
  isManual: false,
  modelCount: 0,
  proposedModelCount: 0,
});

const tree = buildCategoryTree([
  category(1, null, 'Фурнітура'),
  category(2, 1, 'Замки'),
  { ...category(3, 2, 'Навісні'), siteNameUk: 'Навісні та велозамки' },
  category(4, null, 'Двері'),
]);

describe('categoryTableRows', () => {
  it('shows children only under open parents, with depth and the path of site names', () => {
    const closed = categoryTableRows(tree, new Set());
    expect(closed.map((row) => row.id)).toEqual([1, 4]);
    expect(closed[0]).toMatchObject({ depth: 0, hasChildren: true, open: false, path: [] });

    const open = categoryTableRows(tree, new Set([1, 2]));
    expect(open.map((row) => row.id)).toEqual([1, 2, 3, 4]);
    expect(open[2]).toMatchObject({ depth: 2, hasChildren: false, path: ['Фурнітура', 'Замки'] });
  });

  it('opens every parent while searching', () => {
    expect(categoryTableRows(tree, new Set(), true).map((row) => row.id)).toEqual([1, 2, 3, 4]);
  });
});

describe('parentCategoryIds', () => {
  it('lists every category with children', () => {
    expect(parentCategoryIds(tree)).toEqual([1, 2]);
  });
});
