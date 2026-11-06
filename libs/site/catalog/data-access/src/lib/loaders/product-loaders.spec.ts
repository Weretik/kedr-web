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

const list = {
  categorySlug: 'zavisy',
  isFinalCategory: true,
  page: 2,
  pageSize: 20,
  totalPages: 3,
  totalRecords: 60,
  items: [],
  filters: [],
  exactMatch: null,
};

describe('getProductListPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads one page of category models with attribute filters and paging info', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: list });

    const page = await getProductListPage(
      'uk',
      { categorySlug: 'zavisy' },
      { ...DEFAULT_LISTING_QUERY, page: 2, attributes: { kolir: ['bronza', 'khrom'] } },
    );

    expect(page).toEqual({
      items: [],
      page: 2,
      pageSize: 20,
      totalPages: 3,
      totalRecords: 60,
      filters: [],
      exactMatch: null,
    });
    expect(siteApiGet).toHaveBeenCalledWith('/api/catalog/{lang}/{categorySlug}/models', {
      path: { lang: 'uk', categorySlug: 'zavisy' },
      query: expect.objectContaining({
        filter: ['kolir:bronza,khrom'],
        page: 2,
        pageSize: 20,
        sort: 'default',
      }),
    });
    expect(cacheTag).toHaveBeenCalledWith('catalog', 'catalog:products');
    expect(cacheLife).toHaveBeenCalledWith('hours');
  });

  it('searches models over the whole site without attribute filters', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: { ...list, categorySlug: null } });

    await getProductListPage(
      'ru',
      { searchTerm: '1201' },
      { ...DEFAULT_LISTING_QUERY, attributes: { kolir: ['khrom'] } },
    );

    expect(siteApiGet).toHaveBeenCalledWith('/api/catalog/{lang}/models', {
      path: { lang: 'ru' },
      query: expect.not.objectContaining({ filter: expect.anything() }),
    });
    expect(siteApiGet.mock.calls[0]?.[1].query.search).toBe('1201');
  });

  it('lists nothing for an unknown filter value', async () => {
    siteApiGet.mockResolvedValue({ kind: 'not-found' });

    const page = await getProductListPage('uk', { categorySlug: 'zavisy' }, DEFAULT_LISTING_QUERY);

    expect(page?.items).toEqual([]);
    expect(page?.totalRecords).toBe(0);
  });

  it('returns null with a short lifetime when the API fails', async () => {
    siteApiGet.mockResolvedValue({ kind: 'unavailable', status: 500 });

    expect(await getProductListPage('ru', { searchTerm: 'x' }, DEFAULT_LISTING_QUERY)).toBeNull();
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });
});
