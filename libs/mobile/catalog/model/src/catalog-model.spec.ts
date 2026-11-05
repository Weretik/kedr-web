import {
  allImageUrls,
  categoryPath,
  childrenOf,
  essentialImageUrls,
  filterProducts,
  formatStock,
  parentsOf,
  productImages,
  resolvePriceKopecks,
  sortProducts,
  withDescendants,
  type Category,
  type PricedProduct,
} from './index';

const categories: Category[] = [
  { id: 1, name: 'Фурнітура', parentId: null, sortOrder: 0 },
  { id: 10, name: 'Ручки', parentId: 1, sortOrder: 1 },
  { id: 11, name: 'Ручки на розетці', parentId: 10, sortOrder: 0 },
  { id: 20, name: 'Замки', parentId: 1, sortOrder: 0 },
];
const parents = parentsOf(categories);

const product = (overrides: Partial<PricedProduct>): PricedProduct => ({
  categoryId: 11,
  id: 101,
  isNew: false,
  isSale: false,
  name: 'Ручка «Нова» хром',
  photos: [],
  priceKopecks: 10_000,
  quantityInPack: 1,
  scheme: null,
  slug: 'ruchka',
  stock: 5,
  ...overrides,
});

describe('customer price (SC-006, KedrStore WorkspacePricingTests)', () => {
  const customer = { defaultPriceTypeId: 2, rules: new Map([[10, 3]]) };
  const prices = new Map([
    [2, 10_000],
    [3, 20_000],
  ]);

  it('uses the rule of the nearest parent for a subcategory and the default elsewhere', () => {
    expect(resolvePriceKopecks(11, prices, customer, parents)).toBe(20_000);
    expect(resolvePriceKopecks(20, prices, customer, parents)).toBe(10_000);
  });

  it('gives null when the product has no price of the resolved type, without falling back', () => {
    expect(resolvePriceKopecks(11, new Map([[2, 10_000]]), customer, parents)).toBeNull();
  });

  it('stops on a parent cycle', () => {
    const cycle = new Map<number, number | null>([
      [5, 6],
      [6, 5],
    ]);
    expect(resolvePriceKopecks(5, prices, customer, cycle)).toBe(10_000);
  });
});

describe('category tree', () => {
  it('lists children in catalog order, walks subcategories and builds the path', () => {
    expect(childrenOf(categories, 1).map((c) => c.name)).toEqual(['Замки', 'Ручки']);
    expect([...withDescendants(categories, 10)]).toEqual([10, 11]);
    expect(categoryPath(categories, 11).map((c) => c.id)).toEqual([1, 10, 11]);
  });
});

describe('product search (SC-008)', () => {
  const list = [
    product({}),
    product({ categoryId: 20, id: 205, name: 'Замок врізний', stock: 0 }),
    product({ id: 102, name: 'Ручка «Класик» бронза', priceKopecks: null }),
  ];

  it('finds by code start or by every word of the name', () => {
    const all = { categoryIds: null, inStockOnly: false, query: '' };
    expect(filterProducts(list, { ...all, query: '20' }).map((p) => p.id)).toEqual([205]);
    expect(filterProducts(list, { ...all, query: 'ручка хром' }).map((p) => p.id)).toEqual([101]);
  });

  it('narrows by a category with its subcategories and by stock', () => {
    const found = filterProducts(list, {
      categoryIds: withDescendants(categories, 1),
      inStockOnly: true,
      query: '',
    });
    expect(found.map((p) => p.id)).toEqual([101, 102]);
  });

  it('sorts by price with unpriced products last', () => {
    expect(sortProducts(list, 'price-desc').map((p) => p.id)).toEqual([205, 101, 102]);
    expect(sortProducts(list, 'name').map((p) => p.id)).toEqual([205, 102, 101]);
  });
});

describe('images and stock', () => {
  it('puts the scheme after the photos and collects offline sets', () => {
    const item = { photos: ['a.jpg', 'b.jpg'], scheme: 's.png' };
    expect(productImages(item).map((i) => i.kind)).toEqual(['photo', 'photo', 'scheme']);
    expect(essentialImageUrls([item, item])).toEqual(['a.jpg', 's.png']);
    expect(allImageUrls([item])).toEqual(['a.jpg', 'b.jpg', 's.png']);
  });

  it('formats whole and fractional stock', () => {
    expect(formatStock(12)).toBe('12 шт.');
    expect(formatStock(2.5)).toBe('2,5 шт.');
  });
});
