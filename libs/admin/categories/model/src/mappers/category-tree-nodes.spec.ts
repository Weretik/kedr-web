import { describe, expect, it } from 'vitest';

import { buildCategoryTree, categoryAncestorIds, filterCategoryTree } from './category-tree-nodes';

import type { AdminCategory } from '../entities/admin-category';

const category = (overrides: Partial<AdminCategory>): AdminCategory => ({
  deletedAt: null,
  id: 1,
  isDeleted: false,
  isShownOnSite: true,
  level: 0,
  nameRu: '',
  nameUk: 'Категорія',
  parentId: null,
  slug: 'category',
  sortOrder: 0,
  sourceKey: '1',
  sourceName: '',
  productCount: null,
  filledLanguages: null,
  ...overrides,
});

const rows = [
  category({ id: 1, nameUk: 'Замки', slug: 'zamky' }),
  category({ id: 2, nameUk: 'Врізні замки', nameRu: 'Врезные', parentId: 1, slug: 'vrizni' }),
  category({ id: 3, nameUk: 'Накладні замки', parentId: 1, slug: 'nakladni', sortOrder: 1 }),
  category({ id: 4, nameUk: 'Завіси', slug: 'zavisy', sortOrder: 1 }),
  category({ id: 5, nameUk: 'Сирота', parentId: 99, slug: 'syrota', sortOrder: 2 }),
];

describe('buildCategoryTree', () => {
  it('nests children under parents in display order and keeps orphans as roots', () => {
    const tree = buildCategoryTree(rows);

    expect(tree.map((node) => node.category.id)).toEqual([1, 4, 5]);
    expect(tree[0].children.map((node) => node.category.id)).toEqual([2, 3]);
  });
});

describe('categoryAncestorIds', () => {
  it('returns the path from the root without the category itself', () => {
    const byId = new Map(rows.map((row) => [row.id, row]));

    expect(categoryAncestorIds(2, byId)).toEqual([1]);
    expect(categoryAncestorIds(1, byId)).toEqual([]);
    expect(categoryAncestorIds(5, byId)).toEqual([]);
  });
});

describe('filterCategoryTree', () => {
  it('keeps matches by Ukrainian, Russian name or address with their ancestors', () => {
    const tree = buildCategoryTree(rows);

    const byRussian = filterCategoryTree(tree, 'врезные');
    expect(byRussian.tree.map((node) => node.category.id)).toEqual([1]);
    expect(byRussian.tree[0].children.map((node) => node.category.id)).toEqual([2]);
    expect([...byRussian.matchIds]).toEqual([2]);

    expect(filterCategoryTree(tree, 'ZAVISY').tree.map((node) => node.category.id)).toEqual([4]);
    expect(filterCategoryTree(tree, '  ').tree).toHaveLength(3);
    expect(filterCategoryTree(tree, 'немає').tree).toEqual([]);
  });

  it('applies an extra condition with or without a search term', () => {
    const tree = buildCategoryTree(rows);
    const onlyNakladni = (row: AdminCategory) => row.id === 3;

    const filtered = filterCategoryTree(tree, '', onlyNakladni);
    expect(filtered.tree.map((node) => node.category.id)).toEqual([1]);
    expect(filtered.tree[0].children.map((node) => node.category.id)).toEqual([3]);
    expect(filterCategoryTree(tree, 'zavisy', onlyNakladni).tree).toEqual([]);
  });
});
