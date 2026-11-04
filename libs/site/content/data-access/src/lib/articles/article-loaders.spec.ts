import { getArticle, getArticles } from './article-loaders';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));
vi.mock('@site/core/config', () => ({ siteConfig: { apiUrl: 'https://api.example.test' } }));

const summary = {
  id: 4,
  slug: 'prykhovani-petli',
  title: 'Приховані петлі',
  excerpt: 'Коротко.',
  publishedOn: '2026-03-24',
  coverPath: '/api/content/articles/4/cover?v=2',
  coverUrl: null,
  updatedAt: '2026-11-04T00:00:00Z',
};

describe('article loaders', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps the published list with absolute cover URLs and tags it', async () => {
    siteApiGet.mockResolvedValue({
      kind: 'ok',
      data: [
        summary,
        { ...summary, id: 5, coverPath: null },
        {
          ...summary,
          id: 6,
          coverPath: null,
          coverUrl: 'https://images-kedr.cdn.express/articles/a.webp',
        },
      ],
    });

    const articles = await getArticles('uk');

    expect(siteApiGet).toHaveBeenCalledWith('/api/content/{lang}/articles', {
      path: { lang: 'uk' },
    });
    expect(articles).toEqual([
      {
        id: 4,
        slug: 'prykhovani-petli',
        title: 'Приховані петлі',
        excerpt: 'Коротко.',
        bodyHtml: '',
        image: 'https://api.example.test/api/content/articles/4/cover?v=2',
        publishedAt: '2026-03-24',
      },
      expect.objectContaining({ id: 5, image: null }),
      expect.objectContaining({ id: 6, image: 'https://images-kedr.cdn.express/articles/a.webp' }),
    ]);
    expect(cacheTag).toHaveBeenCalledWith('content', 'content:articles');
  });

  it('returns null and a short cache life when the API is unavailable', async () => {
    siteApiGet.mockResolvedValue({ kind: 'unavailable' });

    expect(await getArticles('ru')).toBeNull();
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });

  it('reads one article with its body, and separates missing from unavailable', async () => {
    siteApiGet.mockResolvedValueOnce({
      kind: 'ok',
      data: { ...summary, bodyHtml: '<p>Текст</p>' },
    });
    siteApiGet.mockResolvedValueOnce({ kind: 'not-found' });
    siteApiGet.mockResolvedValueOnce({ kind: 'unavailable', status: 503 });

    expect(await getArticle('uk', 'prykhovani-petli')).toMatchObject({
      kind: 'ok',
      article: { bodyHtml: '<p>Текст</p>', slug: 'prykhovani-petli' },
    });
    expect(siteApiGet).toHaveBeenCalledWith('/api/content/{lang}/articles/{slug}', {
      path: { lang: 'uk', slug: 'prykhovani-petli' },
    });
    expect(cacheTag).toHaveBeenCalledWith(
      'content',
      'content:articles',
      'article:prykhovani-petli',
    );
    expect(await getArticle('uk', 'draft')).toEqual({ kind: 'not-found' });
    expect(await getArticle('uk', 'any')).toEqual({ kind: 'unavailable' });
  });
});
