import { isCatalogFilterSelectionValid, isCatalogQueryValid } from './catalog-filters';
import { defaultCatalogQuery } from './catalog-query';

describe('catalog filter validation', () => {
  it.each([
    [{ priceFrom: -1 }, false],
    [{ priceTo: -1 }, false],
    [{ priceFrom: Number.NaN }, false],
    [{ priceFrom: 20, priceTo: 10 }, false],
    [{ categoryId: 0 }, false],
    [{ categoryId: 1.5 }, false],
    [{ categorySlug: 'a'.repeat(101) }, false],
    [{ categoryId: 1, priceFrom: 10, priceTo: 20 }, true],
  ] as const)('validates documented filters %#', (filters, expected) => {
    expect(isCatalogFilterSelectionValid(filters)).toBe(expected);
  });

  it('validates page and sort together with filters', () => {
    expect(isCatalogQueryValid(defaultCatalogQuery)).toBe(true);
    expect(isCatalogQueryValid({ ...defaultCatalogQuery, page: 0 })).toBe(false);
    expect(
      isCatalogQueryValid({
        ...defaultCatalogQuery,
        sort: 'Unsupported' as typeof defaultCatalogQuery.sort,
      }),
    ).toBe(false);
  });
});
