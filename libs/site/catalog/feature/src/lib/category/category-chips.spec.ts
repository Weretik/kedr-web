import { categoryChips } from './category-chips';

const leaf = (id: number) => ({
  id,
  slug: `c-${id}`,
  name: `C${id}`,
  productCount: 1,
  children: [],
});
const tree = [{ ...leaf(1), children: [{ ...leaf(2), children: [leaf(3), leaf(4)] }] }, leaf(5)];

describe('categoryChips', () => {
  it('shows the subcategories of a category that has them', () => {
    expect(categoryChips([leaf(9)], 2, tree)).toEqual([leaf(9)]);
  });

  it('shows the siblings of a category without subcategories', () => {
    expect(categoryChips([], 4, tree).map((chip) => chip.id)).toEqual([3, 4]);
  });

  it('shows nothing for a top-level leaf, an unknown category, or a missing tree', () => {
    expect(categoryChips([], 5, tree)).toEqual([]);
    expect(categoryChips([], 42, tree)).toEqual([]);
    expect(categoryChips([], 4, null)).toEqual([]);
  });
});
