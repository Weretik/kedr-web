import { ALL_PRODUCTS_PATH, categoryPath, productPath } from './catalog-paths';

describe('catalog paths', () => {
  it('keeps the current storefront addresses', () => {
    expect(categoryPath('zamki-900002')).toBe('/catalog/zamki-900002/products');
    expect(productPath('zavisa-1')).toBe('/catalog/product/zavisa-1');
    expect(ALL_PRODUCTS_PATH).toBe('/catalog/products');
  });

  it('encodes unsafe slugs', () => {
    expect(productPath('a b')).toBe('/catalog/product/a%20b');
  });
});
