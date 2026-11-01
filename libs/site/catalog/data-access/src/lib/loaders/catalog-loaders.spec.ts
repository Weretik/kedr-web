import { getCatalogSections, getCatalogTree, getInStockProducts } from './catalog-loaders';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

describe('catalog loaders', () => {
  beforeEach(() => vi.clearAllMocks());

  it('caches the category tree for hours under the catalog tags', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: [] });

    expect(await getCatalogSections('ru')).toEqual([]);
    expect(siteApiGet).toHaveBeenCalledWith('/api/catalog/{lang}/categories', {
      path: { lang: 'ru' },
    });
    expect(cacheTag).toHaveBeenCalledWith('catalog', 'catalog:categories');
    expect(cacheLife).toHaveBeenCalledWith('hours');
  });

  it('returns null and a short lifetime when the API is unavailable', async () => {
    siteApiGet.mockResolvedValue({ kind: 'unavailable', status: 503 });

    expect(await getCatalogSections('uk')).toBeNull();
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });

  it('requests the newest in-stock products', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: { pagedInfo: {}, value: [] } });

    expect(await getInStockProducts('uk')).toEqual([]);
    expect(siteApiGet).toHaveBeenCalledWith('/api/catalog/{lang}/products', {
      path: { lang: 'uk' },
      query: { inStock: true, sort: 'IdDesc', page: 1, pageSize: 8 },
    });
    expect(cacheTag).toHaveBeenCalledWith('catalog', 'catalog:products');
  });

  it('maps the whole tree with counts', async () => {
    siteApiGet.mockResolvedValue({
      kind: 'ok',
      data: [
        {
          id: 1,
          slug: 'a',
          name: 'A',
          parentId: null,
          sortOrder: 1,
          level: 0,
          productCount: 4,
          children: [],
        },
      ],
    });

    expect(await getCatalogTree('uk')).toEqual([
      { id: 1, slug: 'a', name: 'A', productCount: 4, children: [] },
    ]);
    expect(cacheTag).toHaveBeenCalledWith('catalog', 'catalog:categories');
  });
});
