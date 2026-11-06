import {
  generateCategoryMetadata,
  generateLandingMetadata,
  getCatalogSitemapPages,
  getCategoryStaticParams,
} from './category-routing';

const { getCatalogTree, getCategory, getProductListPage } = vi.hoisted(() => ({
  getCatalogTree: vi.fn(),
  getCategory: vi.fn(),
  getProductListPage: vi.fn(),
}));
vi.mock('@site/catalog/data-access', () => ({ getCatalogTree, getCategory, getProductListPage }));

const value = (slug: string, name: string, count: number) => ({
  slug,
  name,
  hex: null,
  textureUrl: null,
  count,
  selected: false,
});

const colorFilter = {
  code: 'color',
  slug: 'kolir',
  name: 'Колір',
  display: 'swatch',
  values: [value('khrom', 'Хром', 12), value('bile-zoloto', 'Біле золото', 1)],
};

const listPage = (filters: unknown[] = [], items: unknown[] = [{}]) => ({
  items,
  page: 1,
  pageSize: 20,
  totalPages: 1,
  totalRecords: items.length,
  filters,
  exactMatch: null,
});

const tree = [
  {
    id: 1,
    slug: 'ruchky',
    name: 'Ручки',
    productCount: 3,
    children: [{ id: 2, slug: 'na-rozetsi', name: 'На розетці', productCount: 3, children: [] }],
  },
];

describe('category routing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('prerenders top-level sections, or a placeholder when the API is down', async () => {
    getCatalogTree.mockResolvedValueOnce(tree);
    expect(await getCategoryStaticParams('uk')).toEqual([{ slug: 'ruchky' }]);

    getCatalogTree.mockResolvedValueOnce(null);
    expect(await getCategoryStaticParams('uk')).toEqual([{ slug: '__placeholder__' }]);
  });

  it('lists the hub, every category, and value pages of final categories in the sitemap', async () => {
    getCatalogTree.mockResolvedValue(tree);
    getProductListPage.mockResolvedValue(listPage([colorFilter]));

    expect(await getCatalogSitemapPages()).toEqual([
      { path: '/catalog' },
      { path: '/catalog/ruchky' },
      { path: '/catalog/na-rozetsi' },
      { path: '/catalog/na-rozetsi/khrom' },
    ]);
    expect(getProductListPage).toHaveBeenCalledTimes(1);
    expect(getProductListPage.mock.calls[0]?.[1]).toEqual({ categorySlug: 'na-rozetsi' });
  });

  it('fails the sitemap when a list of a final category is unavailable', async () => {
    getCatalogTree.mockResolvedValue(tree);
    getProductListPage.mockResolvedValue(null);
    await expect(getCatalogSitemapPages()).rejects.toThrow('unavailable for the sitemap');
  });

  it('fails the sitemap instead of dropping every category when the tree is unavailable', async () => {
    getCatalogTree.mockResolvedValue(null);
    await expect(getCatalogSitemapPages()).rejects.toThrow('Catalog tree is unavailable');
  });

  it('marks a page past the end noindex', async () => {
    getCategory.mockResolvedValue({
      kind: 'ok',
      category: {
        id: 1,
        slug: 'ruchky',
        name: 'Ручки',
        productCount: 3,
        breadcrumbs: [],
        children: [],
        minPrice: null,
        maxPrice: null,
        content: null,
      },
    });
    getProductListPage.mockResolvedValue({
      items: [],
      page: 5,
      pageSize: 24,
      totalPages: 1,
      totalRecords: 3,
    });

    const metadata = await generateCategoryMetadata('uk', 'ruchky', Promise.resolve({ page: '5' }));

    expect(metadata.robots).toMatchObject({ index: false });
  });

  it('leaves metadata to the page for moved and missing categories', async () => {
    getCategory.mockResolvedValue({ kind: 'moved', slug: 'x' });

    expect(await generateCategoryMetadata('uk', 'old', Promise.resolve({}))).toEqual({});
    expect(await generateCategoryMetadata('uk', '__placeholder__', Promise.resolve({}))).toEqual(
      {},
    );
  });

  it('builds value page metadata from the value in the path', async () => {
    getCategory.mockResolvedValue({
      kind: 'ok',
      category: {
        id: 4,
        slug: 'zavisy',
        name: 'Завіси',
        productCount: 30,
        breadcrumbs: [],
        children: [],
        minPrice: null,
        maxPrice: null,
        content: null,
      },
    });
    getProductListPage.mockResolvedValue(listPage([colorFilter]));

    const metadata = await generateLandingMetadata(
      'uk',
      'zavisy',
      'khrom',
      Promise.resolve({ kolir: 'zoloto' }),
    );

    expect(metadata.title).toBe('Завіси хром — купити оптом і в роздріб');
    expect(String(metadata.alternates?.canonical)).toMatch(/\/uk\/catalog\/zavisy\/khrom$/);
    expect(await generateLandingMetadata('uk', 'zavisy', 'missing', Promise.resolve({}))).toEqual(
      {},
    );
  });
});
