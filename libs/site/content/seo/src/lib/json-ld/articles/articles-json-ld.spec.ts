import { COMPANY, createSiteConfig } from '@site/core/config';

import { buildArticleJsonLd, buildArticlesBreadcrumbJsonLd } from './articles-json-ld';

const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const article = {
  slug: 'zamak-chy-aliuminii',
  title: 'ZAMAK чи алюміній',
  excerpt: 'Матеріал ручки безпосередньо впливає на ресурс.',
  image: '/images/articles/Article_3.jpg',
  publishedAt: '2026-03-24',
};

describe('article structured data', () => {
  it.each([
    { locale: 'uk', home: 'Головна', list: 'Статті', language: 'uk-UA' },
    { locale: 'ru', home: 'Главная', list: 'Статьи', language: 'ru-UA' },
  ] as const)('describes visible $locale list breadcrumbs and no Article on the list', (page) => {
    expect(buildArticlesBreadcrumbJsonLd(page.locale, config)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: page.home,
          item: config.siteUrl + '/' + page.locale,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.list,
          item: config.siteUrl + '/' + page.locale + '/articles',
        },
      ],
    });
  });

  it.each([
    { locale: 'uk', home: 'Головна', list: 'Статті', language: 'uk-UA' },
    { locale: 'ru', home: 'Главная', list: 'Статьи', language: 'ru-UA' },
  ] as const)(
    'builds the complete $locale article graph without invented author or modification date',
    (page) => {
      const canonical = config.siteUrl + '/' + page.locale + '/articles/' + article.slug;
      const graph = buildArticleJsonLd(page.locale, article, config);
      expect(graph['@context']).toBe('https://schema.org');
      expect(graph['@graph']).toEqual([
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: page.home,
              item: config.siteUrl + '/' + page.locale,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: page.list,
              item: config.siteUrl + '/' + page.locale + '/articles',
            },
            { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
          ],
        },
        {
          '@type': 'Article',
          '@id': canonical + '#article',
          headline: article.title,
          description: article.excerpt,
          image: config.siteUrl + article.image,
          inLanguage: page.language,
          datePublished: '2026-03-24',
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
          publisher: { '@type': 'Organization', name: COMPANY.name, url: config.siteUrl },
        },
      ]);
      expect(JSON.stringify(graph)).not.toContain('dateModified');
      expect(JSON.stringify(graph)).not.toContain('author');
    },
  );

  it('omits images when the source cover is absent', () => {
    const graph = buildArticleJsonLd('uk', { ...article, image: null }, config)['@graph'] as Record<
      string,
      unknown
    >[];
    expect(graph[1]).not.toHaveProperty('image');
  });
});
