import { CATALOG_PATH, SEARCH_PATH, categoryPath, productPath } from './catalog-paths';

describe('catalog paths', () => {
  it('uses the flat catalog addresses', () => {
    expect(categoryPath('zamky')).toBe('/catalog/zamky');
    expect(productPath('zavisa-1')).toBe('/product/zavisa-1');
    expect(CATALOG_PATH).toBe('/catalog');
    expect(SEARCH_PATH).toBe('/search');
  });

  it('encodes unsafe slugs', () => {
    expect(productPath('a b')).toBe('/product/a%20b');
  });
});
