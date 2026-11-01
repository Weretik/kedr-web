import { mapCatalogTree } from './category-tree.mapper';

const node = (id: number, sortOrder: number, overrides: Record<string, unknown> = {}) => ({
  id,
  slug: `c-${id}`,
  name: ` Category ${id} `,
  parentId: null,
  sortOrder,
  level: 0,
  productCount: id * 10,
  children: [],
  ...overrides,
});

describe('mapCatalogTree', () => {
  it('keeps the whole tree in display order with counts', () => {
    const tree = mapCatalogTree([node(2, 1, { children: [node(5, 2), node(4, 1)] }), node(1, 1)]);

    expect(tree.map((item) => item.id)).toEqual([1, 2]);
    expect(tree[1].children.map((item) => item.id)).toEqual([4, 5]);
    expect(tree[0]).toEqual({
      id: 1,
      slug: 'c-1',
      name: 'Category 1',
      productCount: 10,
      children: [],
    });
  });

  it('drops nodes without a slug or name together with their subtrees', () => {
    const tree = mapCatalogTree([
      node(1, 1, { slug: ' ', children: [node(2, 1)] }),
      node(3, 2, { name: '' }),
    ]);

    expect(tree).toEqual([]);
  });
});
