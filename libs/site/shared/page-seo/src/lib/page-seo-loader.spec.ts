import { getPageSeoTexts } from './page-seo-loader';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

describe('getPageSeoTexts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps the set texts by page', async () => {
    siteApiGet.mockResolvedValue({
      kind: 'ok',
      data: [
        { page: 'Wholesale', title: 'Фурнитура оптом', description: null },
        { page: 'Contacts', title: ' ', description: 'Адрес склада' },
      ],
    });

    const texts = await getPageSeoTexts('ru');

    expect(siteApiGet).toHaveBeenCalledWith('/api/content/{lang}/page-seo', {
      path: { lang: 'ru' },
    });
    expect(cacheTag).toHaveBeenCalledWith('content', 'content:page-seo');
    expect(cacheLife).toHaveBeenCalledWith({ stale: 300, revalidate: 600, expire: 86_400 });
    expect(texts).toEqual({
      Wholesale: { title: 'Фурнитура оптом', description: null },
      Contacts: { title: null, description: 'Адрес склада' },
    });
  });

  it('gives no texts when the API cannot be reached', async () => {
    siteApiGet.mockResolvedValue({ kind: 'unavailable' });

    expect(await getPageSeoTexts('uk')).toEqual({});
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });
});
