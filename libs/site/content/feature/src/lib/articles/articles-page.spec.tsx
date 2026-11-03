import { getArticle, getArticles } from '@site/content/data-access';
import { renderToStaticMarkup } from 'react-dom/server';

import { ArticlePage, generateArticleMetadata, getArticleStaticParams } from './article-page';
import { ArticlesResults, generateArticlesMetadata } from './articles-page';

vi.mock('server-only', () => ({}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  redirect: (href: string) => {
    throw new Error('REDIRECT:' + href);
  },
  notFound: () => {
    throw new Error('NOT_FOUND');
  },
}));

describe.each(['uk', 'ru'] as const)('articles server integration %s', (locale) => {
  it('renders the real source as linked cards, preserves the selected size, and has no nested main', async () => {
    const output = await ArticlesResults({
      locale,
      searchParams: Promise.resolve({ pageSize: '20' }),
    });
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(output);
    expect(container.querySelector('main')).toBeNull();
    for (const article of getArticles(locale)) {
      expect(container.textContent).toContain(article.title);
      expect(
        container.querySelector('a[href="/' + locale + '/articles/' + article.slug + '"]'),
      ).not.toBeNull();
    }
    expect(container.querySelector('select')?.value).toBe('20');
    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });
  it('searches the actual whole text and calculates metadata from the same resolved query', async () => {
    const term = 'ZAMAK';
    const output = await ArticlesResults({ locale, searchParams: Promise.resolve({ q: term }) });
    const html = renderToStaticMarkup(output);
    expect(html).toContain('zamak-chy-aliuminii');
    expect(html).not.toContain('postachannia-dlia-vyrobnykiv-dverei');
    const metadata = await generateArticlesMetadata(
      locale,
      Promise.resolve({ q: term, pageSize: '20' }),
    );
    expect(metadata.alternates?.canonical).toBe('/' + locale + '/articles?q=ZAMAK&pageSize=20');
    expect(metadata.robots).toMatchObject({ index: false });
  });
  it('redirects a page beyond the end to the normalized available page while retaining search and size', async () => {
    await expect(
      ArticlesResults({
        locale,
        searchParams: Promise.resolve({ page: '99', pageSize: '20', q: 'ZAMAK' }),
      }),
    ).rejects.toThrow('REDIRECT:/' + locale + '/articles?q=ZAMAK&pageSize=20');
  });
  it('renders full source text and Article schema, and sends unknown slugs to notFound', () => {
    const article = getArticles(locale)[0];
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<ArticlePage locale={locale} slug={article.slug} />);
    expect(container.querySelector('h1')?.textContent).toBe(article.title);
    for (const paragraph of article.paragraphs) expect(container.textContent).toContain(paragraph);
    expect(container.querySelector('main')).toBeNull();
    expect(container.querySelector('a[href="/' + locale + '/articles"]')).not.toBeNull();
    const graph = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );
    expect(JSON.stringify(graph)).toContain('"@type":"Article"');
    expect(() => ArticlePage({ locale, slug: 'missing-article' })).toThrow('NOT_FOUND');
    expect(() => generateArticleMetadata(locale, 'missing-article')).toThrow('NOT_FOUND');
    expect(generateArticleMetadata(locale, article.slug).alternates?.canonical).toBe(
      '/' + locale + '/articles/' + article.slug,
    );
  });
});
it('prerenders every real slug in both locales and never invents a numeric detail path', () => {
  const params = getArticleStaticParams();
  expect(params).toHaveLength(12);
  expect(getArticleStaticParams('uk')).toHaveLength(6);
  expect(getArticleStaticParams('ru').every((item) => item.locale === 'ru')).toBe(true);
  for (const item of params) expect(getArticle(item.locale, item.slug)).toBeDefined();
  expect(params.every(({ slug }) => !/^\d+$/.test(slug))).toBe(true);
});
