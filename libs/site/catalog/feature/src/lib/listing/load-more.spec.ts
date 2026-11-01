import { loadMoreProducts } from './load-more';

const { getProductListPage } = vi.hoisted(() => ({ getProductListPage: vi.fn() }));
vi.mock('@site/catalog/data-access', () => ({ getProductListPage }));

describe('loadMoreProducts', () => {
  beforeEach(() => getProductListPage.mockReset().mockResolvedValue({ items: [] }));

  it('loads the next page with the choices parsed again', async () => {
    await loadMoreProducts('ru', { categoryId: 9 }, 'inStock=true&sort=bogus', 2);

    expect(getProductListPage).toHaveBeenCalledWith(
      'ru',
      { categoryId: 9 },
      expect.objectContaining({ inStock: true, sort: 'availability', page: 2 }),
    );
  });

  it('rejects arguments a browser could forge', async () => {
    expect(await loadMoreProducts('en', { categoryId: 9 }, '', 2)).toBeNull();
    expect(await loadMoreProducts('uk', { categoryId: -1 }, '', 2)).toBeNull();
    expect(await loadMoreProducts('uk', { searchTerm: 'x'.repeat(500) }, '', 2)).toBeNull();
    expect(await loadMoreProducts('uk', { categoryId: 9 }, '', 'two')).toBeNull();
    expect(await loadMoreProducts('uk', { categoryId: 9 }, 42, 2)).toBeNull();
    expect(getProductListPage).not.toHaveBeenCalled();
  });
});
