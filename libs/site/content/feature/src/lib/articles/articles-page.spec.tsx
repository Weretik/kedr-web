import { renderToStaticMarkup } from 'react-dom/server';

import { ArticlePage, generateArticleMetadata, getArticleStaticParams } from './article-page';
import { getArticleSitemapPages } from './article-sitemap';
import { ArticlesResults, generateArticlesMetadata } from './articles-page';

import type { Article } from '@site/content/model';

const { getArticles, getArticle } = vi.hoisted(() => ({
  getArticles: vi.fn(),
  getArticle: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@site/content/data-access', () => ({ getArticles, getArticle }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  redirect: (href: string) => {
    throw new Error('REDIRECT:' + href);
  },
  notFound: () => {
    throw new Error('NOT_FOUND');
  },
}));

const article = (id: number, slug: string, title: string): Article => ({
  id,
  slug,
  title,
  excerpt: title + ': коротко.',
  bodyHtml: '<p>' + title + ' — повний текст.</p><h2>Підзаголовок</h2>',
  image: 'https://api.example.test/api/content/articles/' + id + '/cover?v=1',
  publishedAt: '2026-03-24',
});

const ARTICLES = [
  article(3, 'zamak-chy-aliuminii', 'ZAMAK чи алюміній'),
  article(2, 'postachannia-dlia-vyrobnykiv-dverei', 'Серійність поставок'),
];

beforeEach(() => {
  vi.clearAllMocks();
  getArticles.mockResolvedValue(ARTICLES);
  getArticle.mockImplementation(async (_locale: string, slug: string) => {
    const found = ARTICLES.find((item) => item.slug === slug);
    return found ? { kind: 'ok', article: found } : { kind: 'not-found' };
  });
});

describe.each(['uk', 'ru'] as const)('articles server integration %s', (locale) => {
  it('renders the API list as linked cards, preserves the selected size, and has no nested main', async () => {
    const output = await ArticlesResults({
      locale,
      searchParams: Promise.resolve({ pageSize: '20' }),
    });
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(output);
    expect(getArticles).toHaveBeenCalledWith(locale);
    expect(container.querySelector('main')).toBeNull();
    for (const item of ARTICLES) {
      expect(container.textContent).toContain(item.title);
      expect(
        container.querySelector('a[href="/' + locale + '/articles/' + item.slug + '"]'),
      ).not.toBeNull();
    }
    expect(container.querySelector('select')?.value).toBe('20');
  });

  it('searches titles and calculates metadata from the same resolved query', async () => {
    const output = await ArticlesResults({ locale, searchParams: Promise.resolve({ q: 'ZAMAK' }) });
    const html = renderToStaticMarkup(output);
    expect(html).toContain('zamak-chy-aliuminii');
    expect(html).not.toContain('postachannia-dlia-vyrobnykiv-dverei');
    const metadata = await generateArticlesMetadata(
      locale,
      Promise.resolve({ q: 'ZAMAK', pageSize: '20' }),
    );
    expect(metadata.alternates?.canonical).toBe('/' + locale + '/articles?q=ZAMAK&pageSize=20');
    expect(metadata.robots).toMatchObject({ index: false });
  });

  it('redirects a page beyond the end to the normalized available page', async () => {
    await expect(
      ArticlesResults({
        locale,
        searchParams: Promise.resolve({ page: '99', pageSize: '20', q: 'ZAMAK' }),
      }),
    ).rejects.toThrow('REDIRECT:/' + locale + '/articles?q=ZAMAK&pageSize=20');
  });

  it('fails the list with an error instead of an empty page when the API is unavailable', async () => {
    getArticles.mockResolvedValue(null);
    await expect(ArticlesResults({ locale, searchParams: Promise.resolve({}) })).rejects.toThrow(
      'Content API is unavailable',
    );
  });

  it('renders the sanitized body and Article schema, and sends unknown slugs to notFound', async () => {
    const [first] = ARTICLES;
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(await ArticlePage({ locale, slug: first.slug }));
    expect(container.querySelector('h1')?.textContent).toBe(first.title);
    expect(container.textContent).toContain(first.title + ' — повний текст.');
    expect(container.querySelector('h2')?.textContent).toBe('Підзаголовок');
    expect(container.querySelector('main')).toBeNull();
    const graph =
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}';
    expect(graph).toContain('"@type":"Article"');
    await expect(ArticlePage({ locale, slug: 'missing-article' })).rejects.toThrow('NOT_FOUND');
    await expect(generateArticleMetadata(locale, 'missing-article')).rejects.toThrow('NOT_FOUND');
    expect((await generateArticleMetadata(locale, first.slug)).alternates?.canonical).toBe(
      '/' + locale + '/articles/' + first.slug,
    );
  });

  it('answers an unavailable API with an error, not a 404', async () => {
    getArticle.mockResolvedValue({ kind: 'unavailable' });
    await expect(ArticlePage({ locale, slug: 'zamak-chy-aliuminii' })).rejects.toThrow(
      'Content API is unavailable',
    );
  });
});

it('prerenders every published slug, or a placeholder that answers 404 when the API is down', async () => {
  expect(await getArticleStaticParams('uk')).toEqual(ARTICLES.map(({ slug }) => ({ slug })));
  getArticles.mockResolvedValue(null);
  const [placeholder] = await getArticleStaticParams('ru');
  await expect(ArticlePage({ locale: 'ru', slug: placeholder.slug })).rejects.toThrow('NOT_FOUND');
  expect(getArticle).not.toHaveBeenCalled();
});

it('lists article pages for the sitemap by slug and fails when the API is down', async () => {
  expect(await getArticleSitemapPages()).toEqual([
    { path: '/articles/zamak-chy-aliuminii' },
    { path: '/articles/postachannia-dlia-vyrobnykiv-dverei' },
  ]);
  getArticles.mockResolvedValue(null);
  await expect(getArticleSitemapPages()).rejects.toThrow('unavailable');
});
