import {
  generateCategoryMetadata,
  getCatalogSitemapPages,
  getCategoryStaticParams,
} from './category-routing';

const { getCatalogTree, getCategory, getProductListPage } = vi.hoisted(() => ({
  getCatalogTree: vi.fn(),
  getCategory: vi.fn(),
  getProductListPage: vi.fn(),
}));
vi.mock('@site/catalog/data-access', () => ({ getCatalogTree, getCategory, getProductListPage }));

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

  it('lists the hub and every category in the sitemap', async () => {
    getCatalogTree.mockResolvedValue(tree);

    expect(await getCatalogSitemapPages()).toEqual([
      { path: '/catalog' },
      { path: '/catalog/ruchky' },
      { path: '/catalog/na-rozetsi' },
    ]);
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
});
