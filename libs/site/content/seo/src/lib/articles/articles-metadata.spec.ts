import { createSiteConfig } from '@site/core/config';
import { DEFAULT_OG_IMAGE } from '@site/core/seo';

import { buildArticleMetadata, buildArticlesMetadata } from './articles-metadata';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const defaults = { search: '', q: '', page: 1, pageSize: 10 };
const article = {
  slug: 'zamak-chy-aliuminii',
  title: 'ZAMAK чи алюміній: як обрати матеріал дверної ручки під конкретне навантаження.',
  excerpt:
    'Матеріал ручки безпосередньо впливає на ресурс, відчуття в користуванні та стійкість покриття.',
  image: '/images/articles/Article_3.jpg',
  publishedAt: '2026-03-24',
};

describe('article list metadata', () => {
  it.each([
    { locale: 'uk', title: 'Статті', pageSuffix: 'сторінка', ogLocale: 'uk_UA' },
    { locale: 'ru', title: 'Статьи', pageSuffix: 'страница', ogLocale: 'ru_UA' },
  ] as const)(
    'keeps the $locale list canonical, translated and indexable after the site gate',
    (page) => {
      const metadata = buildArticlesMetadata(page.locale, defaults, production);

      expect(metadata.title).toBe(page.title);
      expect(metadata.description).toBeTruthy();
      expect(metadata.alternates).toEqual({
        canonical: '/' + page.locale + '/articles',
        languages: {
          'uk-UA': '/uk/articles',
          'ru-UA': '/ru/articles',
          'x-default': '/uk/articles',
        },
      });
      expect(metadata.robots).toEqual({ index: true, follow: true });
      expect(metadata.openGraph).toMatchObject({
        type: 'website',
        url: '/' + page.locale + '/articles',
        locale: page.ogLocale,
      });

      const later = buildArticlesMetadata(
        page.locale,
        { ...defaults, page: 2, search: '?page=2' },
        production,
      );
      expect(later.title).toBe(page.title + ' — ' + page.pageSuffix + ' 2');
      expect(later.alternates?.canonical).toBe('/' + page.locale + '/articles?page=2');
      expect(later.alternates?.languages).toEqual({
        'uk-UA': '/uk/articles?page=2',
        'ru-UA': '/ru/articles?page=2',
        'x-default': '/uk/articles?page=2',
      });
      expect(later.robots).toEqual({ index: true, follow: true });
    },
  );

  it.each(['uk', 'ru'] as const)(
    'keeps a self canonical and removes non-equivalent %s search alternates',
    (locale) => {
      const input = { q: 'ZAMAK', page: 2, pageSize: 20, search: '?q=ZAMAK&pageSize=20&page=2' };
      const metadata = buildArticlesMetadata(locale, input, production);

      expect(metadata.title).toContain('ZAMAK');
      expect(metadata.alternates?.canonical).toBe('/' + locale + '/articles' + input.search);
      expect(metadata.alternates?.languages).toBeUndefined();
      expect(metadata.robots).toEqual({ index: false, follow: true });
      expect(metadata.openGraph).toMatchObject({ url: '/' + locale + '/articles' + input.search });
    },
  );

  it.each([20, 50])(
    'marks nondefault page size %s noindex without collapsing its canonical',
    (pageSize) => {
      const metadata = buildArticlesMetadata(
        'uk',
        { ...defaults, pageSize, search: '?pageSize=' + pageSize },
        production,
      );
      expect(metadata.robots).toEqual({ index: false, follow: true });
      expect(metadata.alternates?.canonical).toBe('/uk/articles?pageSize=' + pageSize);
      expect(metadata.alternates?.languages).toBeDefined();
    },
  );

  it.each([
    { SITE_ENV: 'preview', SITE_INDEXING: 'true' },
    { SITE_ENV: 'development', SITE_INDEXING: 'true' },
    { SITE_ENV: 'production' },
  ])('retains the site indexing gate for lists and details (%j)', (environment) => {
    const config = createSiteConfig(environment);
    for (const locale of ['uk', 'ru'] as const) {
      expect(buildArticlesMetadata(locale, defaults, config).robots).toEqual({
        index: false,
        follow: false,
      });
      expect(
        buildArticlesMetadata(locale, { ...defaults, q: 'ручки', search: '?q=ручки' }, config)
          .robots,
      ).toEqual({ index: false, follow: false });
      expect(buildArticleMetadata(locale, article, config).robots).toEqual({
        index: false,
        follow: false,
      });
    }
  });
});

describe('article detail metadata', () => {
  it.each(['uk', 'ru'] as const)(
    'describes the %s article with its source fields and absolute Open Graph cover',
    (locale) => {
      const metadata = buildArticleMetadata(locale, article, production);
      expect(metadata.title).toBe(article.title);
      expect(metadata.description).toBe(article.excerpt);
      expect(metadata.alternates).toEqual({
        canonical: '/' + locale + '/articles/' + article.slug,
        languages: {
          'uk-UA': '/uk/articles/' + article.slug,
          'ru-UA': '/ru/articles/' + article.slug,
          'x-default': '/uk/articles/' + article.slug,
        },
      });
      expect(metadata.openGraph).toMatchObject({
        type: 'article',
        title: article.title,
        description: article.excerpt,
        publishedTime: '2026-03-24',
        images: [{ url: production.siteUrl + article.image, alt: article.title }],
      });
      expect(metadata.openGraph).not.toHaveProperty('modifiedTime');
      expect(metadata.openGraph).not.toHaveProperty('authors');
      expect(metadata.robots).toEqual({ index: true, follow: true });
    },
  );

  it('falls back to the shared preview when the article has no source cover', () => {
    expect(
      buildArticleMetadata('uk', { ...article, image: null }, production).openGraph,
    ).toMatchObject({ images: [DEFAULT_OG_IMAGE] });
  });
});
