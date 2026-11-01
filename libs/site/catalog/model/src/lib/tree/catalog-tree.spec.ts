import { ancestorIds, branchIds, searchCatalogTree } from './catalog-tree';

import type { CatalogTreeNode } from '../entities/catalog-model';

const node = (id: number, name: string, children: CatalogTreeNode[] = []): CatalogTreeNode => ({
  id,
  slug: `c-${id}`,
  name,
  productCount: 1,
  children,
});

const tree = [
  node(1, 'Завіси', [node(11, 'Врізні завіси', [node(111, 'Карткові')]), node(12, 'Накладні')]),
  node(2, 'Замки', [node(21, 'Врізні')]),
];

describe('catalog tree', () => {
  it('finds categories at any depth by every word, with their path', () => {
    expect(searchCatalogTree(tree, 'ВРІЗНІ').map((match) => match.node.id)).toEqual([11, 21]);
    expect(searchCatalogTree(tree, 'врізні  завіси')).toEqual([
      { node: tree[0]?.children[0], path: ['Завіси'] },
    ]);
    expect(searchCatalogTree(tree, 'карт')[0]?.path).toEqual(['Завіси', 'Врізні завіси']);
    expect(searchCatalogTree(tree, '  ')).toEqual([]);
    expect(searchCatalogTree(tree, 'і', 2)).toHaveLength(2);
  });

  it('lists branches and the path to a category', () => {
    expect(branchIds(tree)).toEqual([1, 11, 2]);
    expect(ancestorIds(tree, 111)).toEqual([1, 11, 111]);
    expect(ancestorIds(tree, 99)).toEqual([]);
  });
});
