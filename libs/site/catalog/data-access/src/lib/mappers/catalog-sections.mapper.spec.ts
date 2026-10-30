import { mapCatalogSections } from './catalog-sections.mapper';

import type { components } from '@shared/api-contracts';

type Node = components['schemas']['CategoryTreeNode'];

const node = (id: number, sortOrder: number, overrides: Partial<Node> = {}): Node => ({
  id,
  slug: `c-${id}`,
  name: `Категорія ${id}`,
  parentId: null,
  sortOrder,
  level: 0,
  children: [],
  productCount: 0,
  ...overrides,
});

describe('mapCatalogSections', () => {
  it('orders sections and children by sort order, then id', () => {
    const tree = [node(2, 20, { children: [node(22, 2), node(21, 1), node(23, 1)] }), node(1, 10)];

    const sections = mapCatalogSections(tree);

    expect(sections.map((section) => section.id)).toEqual([1, 2]);
    expect(sections[1]?.children.map((child) => child.id)).toEqual([21, 23, 22]);
  });

  it('drops nodes without a slug or name and trims names', () => {
    const tree = [
      node(1, 1, { name: ' Замки ', children: [node(11, 1, { slug: ' ' })] }),
      node(2, 2, { name: '' }),
    ];

    expect(mapCatalogSections(tree)).toEqual([{ id: 1, slug: 'c-1', name: 'Замки', children: [] }]);
  });
});
