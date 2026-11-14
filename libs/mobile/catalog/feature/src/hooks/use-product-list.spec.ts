import { act, renderHook } from '@testing-library/react-native';

import { useProductList } from './use-product-list';

const product = (id: number, name: string, categoryId: number, stock: number, price: number) => ({
  id,
  slug: `p-${id}`,
  name,
  categoryId,
  stock,
  quantityInPack: 1,
  isSale: false,
  isNew: false,
  photos: [],
  scheme: null,
  priceKopecks: price,
});

jest.mock('@mobile/catalog/data-access', () => ({
  useCategories: () => [
    { id: 1, parentId: null, name: 'Ручки', sortOrder: 1 },
    { id: 2, parentId: 1, name: 'На розетці', sortOrder: 1 },
    { id: 3, parentId: null, name: 'Замки', sortOrder: 2 },
  ],
  usePricedProducts: () => [
    product(10, 'Ручка А', 2, 5, 30_000),
    product(11, 'Ручка Б', 1, 0, 10_000),
    product(12, 'Замок', 3, 2, 50_000),
  ],
}));

describe('useProductList', () => {
  it('filters by category with its subcategories, stock, and sorts by price', async () => {
    const { result } = await renderHook(() => useProductList('c-1'));
    expect(result.current.shown).toHaveLength(3);

    await act(() => result.current.setCategoryId(1));
    expect(result.current.shown.map((p) => p.id)).toEqual([10, 11]);
    expect(result.current.children.map((c) => c.id)).toEqual([2]);

    await act(() => result.current.toggleInStock());
    expect(result.current.shown.map((p) => p.id)).toEqual([10]);

    await act(() => result.current.toggleInStock());
    await act(() => result.current.setSort('price-asc'));
    expect(result.current.shown.map((p) => p.id)).toEqual([11, 10]);
  });
});
