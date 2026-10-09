import { mergeCatalogPages } from './catalog-pages';

describe('mergeCatalogPages', () => {
  it('accumulates unique products and advances page metadata', () => {
    const current = page(1, ['1', '2']);
    mergeCatalogPages(current, page(2, ['2', '3']));
    expect(current.items.map((item) => item.id)).toEqual(['1', '2', '3']);
    expect(current.pageNumber).toBe(2);
  });

  it('replaces accumulated data when page one is fetched again', () => {
    const current = page(2, ['1', '2']);
    mergeCatalogPages(current, page(1, ['4']));
    expect(current.items.map((item) => item.id)).toEqual(['4']);
    expect(current.pageNumber).toBe(1);
  });
});

function page(pageNumber: number, ids: string[]) {
  return {
    items: ids.map((id) => ({
      availability: 'in_stock' as const,
      id,
      imageUrl: null,
      name: id,
      price: 1,
      productSlug: id,
    })),
    pageNumber,
    pageSize: 20,
    totalPages: 2,
    totalRecords: 3,
  };
}
