import { getCategory } from './category-loaders';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

const category = (slug: string) => ({
  id: 9,
  slug,
  name: 'Завіси',
  parentId: null,
  sortOrder: 1,
  level: 0,
  productCount: 3,
  children: [],
  breadcrumbs: [{ id: 9, slug, name: 'Завіси' }],
  minPrice: 10,
  maxPrice: 20,
  content: null,
});

describe('getCategory', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the category and tags it by slug', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: category('zavisy') });

    const result = await getCategory('uk', 'zavisy');

    expect(result).toMatchObject({ kind: 'ok', category: { id: 9, slug: 'zavisy' } });
    expect(siteApiGet).toHaveBeenCalledWith(
      '/api/catalog/{lang}/categories/by-slug/{categorySlug}',
      {
        path: { lang: 'uk', categorySlug: 'zavisy' },
      },
    );
    expect(cacheTag).toHaveBeenCalledWith('catalog', 'catalog:categories', 'category:zavisy');
    expect(cacheLife).toHaveBeenCalledWith('hours');
  });

  it('moves a former slug to the current one', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: category('zavisy-new') });

    expect(await getCategory('uk', 'zavisy')).toEqual({ kind: 'moved', slug: 'zavisy-new' });
  });

  it('moves a deleted category to the ancestor the API names', async () => {
    siteApiGet.mockResolvedValue({
      kind: 'not-found',
      body: { redirectSlug: 'furnitura', redirectType: 'category' },
    });

    expect(await getCategory('ru', 'old')).toEqual({ kind: 'moved', slug: 'furnitura' });
  });

  it('reports a missing slug', async () => {
    siteApiGet.mockResolvedValue({ kind: 'not-found' });

    expect(await getCategory('uk', 'missing')).toEqual({ kind: 'not-found' });
  });

  it('reports an unavailable API with a short lifetime', async () => {
    siteApiGet.mockResolvedValue({ kind: 'unavailable', status: 503 });

    expect(await getCategory('uk', 'zavisy')).toEqual({ kind: 'unavailable' });
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });
});
