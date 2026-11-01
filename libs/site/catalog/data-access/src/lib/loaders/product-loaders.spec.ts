import { DEFAULT_LISTING_QUERY } from '@site/catalog/model';

import { getProductListPage } from './product-loaders';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

describe('getProductListPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads one listing page of a category with its paging info', async () => {
    siteApiGet.mockResolvedValue({
      kind: 'ok',
      data: {
        pagedInfo: { pageNumber: 2, pageSize: 24, totalPages: 3, totalRecords: 60 },
        value: [],
      },
    });

    const page = await getProductListPage(
      'uk',
      { categoryId: 9 },
      { ...DEFAULT_LISTING_QUERY, page: 2 },
    );

    expect(page).toEqual({ items: [], page: 2, pageSize: 24, totalPages: 3, totalRecords: 60 });
    expect(siteApiGet).toHaveBeenCalledWith('/api/catalog/{lang}/products', {
      path: { lang: 'uk' },
      query: expect.objectContaining({
        categoryId: 9,
        page: 2,
        pageSize: 20,
        sort: 'AvailabilityThenName',
      }),
    });
    expect(cacheTag).toHaveBeenCalledWith('catalog', 'catalog:products');
    expect(cacheLife).toHaveBeenCalledWith('hours');
  });

  it('returns null with a short lifetime when the API fails', async () => {
    siteApiGet.mockResolvedValue({ kind: 'unavailable', status: 500 });

    expect(await getProductListPage('ru', { searchTerm: 'x' }, DEFAULT_LISTING_QUERY)).toBeNull();
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });
});
