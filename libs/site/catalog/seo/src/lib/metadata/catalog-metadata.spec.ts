import { DEFAULT_LISTING_QUERY } from '@site/catalog/model';
import { createSiteConfig } from '@site/core/config';

import { buildCategoryMetadata, buildLandingMetadata } from './category-metadata';
import { buildCatalogHubMetadata, buildSearchMetadata } from './hub-search-metadata';

import type { CategoryDetails } from '@site/catalog/model';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });

const category: CategoryDetails = {
  id: 9,
  slug: 'ruchky',
  name: 'Ручки',
  productCount: 312,
  breadcrumbs: [],
  children: [],
  minPrice: 85.5,
  maxPrice: 4200,
  content: null,
};

describe('buildCategoryMetadata', () => {
  it('builds default texts with a self canonical for page 1', () => {
    const metadata = buildCategoryMetadata(
      { locale: 'uk', category, query: DEFAULT_LISTING_QUERY },
      production,
    );

    expect(metadata.title).toBe('Ручки — купити оптом і в роздріб');
    expect(metadata.description).toBe(
      'Ручки: 312 товарів від 85 грн. Опт і роздріб, склад у Харкові, доставка по Україні.',
    );
    expect(metadata.alternates?.canonical).toBe('/uk/catalog/ruchky');
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('keeps page N indexable with its own canonical and title', () => {
    const metadata = buildCategoryMetadata(
      { locale: 'ru', category, query: { ...DEFAULT_LISTING_QUERY, page: 3 } },
      production,
    );

    expect(metadata.title).toBe('Ручки — купить оптом и в розницу — страница 3');
    expect(metadata.alternates?.canonical).toBe('/ru/catalog/ruchky?page=3');
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('marks filtered and past-the-end pages noindex with the page 1 canonical', () => {
    const filtered = buildCategoryMetadata(
      { locale: 'uk', category, query: { ...DEFAULT_LISTING_QUERY, inStock: true, page: 2 } },
      production,
    );
    const pastEnd = buildCategoryMetadata(
      { locale: 'uk', category, query: { ...DEFAULT_LISTING_QUERY, page: 99 }, pastEnd: true },
      production,
    );

    for (const metadata of [filtered, pastEnd]) {
      expect(metadata.robots).toEqual({ index: false, follow: true });
      expect(metadata.alternates?.canonical).toBe('/uk/catalog/ruchky');
    }
  });

  it('prefers the admin SEO title and description', () => {
    const metadata = buildCategoryMetadata(
      {
        locale: 'uk',
        category: {
          ...category,
          content: {
            seoTitle: 'Ручки для дверей',
            metaDescription: 'Опис',
            h1: null,
            bodyHtml: null,
            faq: [],
          },
        },
        query: DEFAULT_LISTING_QUERY,
      },
      production,
    );

    expect(metadata.title).toBe('Ручки для дверей');
    expect(metadata.description).toBe('Опис');
  });
});

describe('hub and search metadata', () => {
  it('indexes the hub and never the search', () => {
    expect(buildCatalogHubMetadata('uk', production)).toMatchObject({
      title: 'Каталог дверної фурнітури',
      alternates: { canonical: '/uk/catalog' },
      robots: { index: true, follow: true },
    });
    expect(buildSearchMetadata('ru', 'agb', production)).toMatchObject({
      title: 'Поиск: agb',
      robots: { index: false, follow: true },
    });
  });
});

describe('buildLandingMetadata', () => {
  const zavisy = { ...category, slug: 'zavisy', name: 'Завіси' };
  const landing = { code: 'color', attribute: 'kolir', value: 'khrom', name: 'Хром', count: 12 };

  it('indexes a value page with two or more models under its own canonical', () => {
    const metadata = buildLandingMetadata(
      { locale: 'uk', category: zavisy, query: DEFAULT_LISTING_QUERY, landing },
      production,
    );

    expect(metadata.title).toBe('Завіси хром — купити оптом і в роздріб');
    expect(metadata.description).toBe(
      'Завіси хром: 12 моделей. Опт і роздріб, склад у Харкові, доставка по Україні.',
    );
    expect(metadata.alternates?.canonical).toBe('/uk/catalog/zavisy/khrom');
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('keeps other choices and single-model values out of the index', () => {
    const sorted = buildLandingMetadata(
      {
        locale: 'uk',
        category: zavisy,
        query: { ...DEFAULT_LISTING_QUERY, sort: 'name' },
        landing,
      },
      production,
    );
    expect(sorted.robots).toEqual({ index: false, follow: true });
    expect(sorted.alternates?.canonical).toBe('/uk/catalog/zavisy/khrom');

    const single = buildLandingMetadata(
      {
        locale: 'uk',
        category: zavisy,
        query: DEFAULT_LISTING_QUERY,
        landing: { ...landing, count: 1 },
      },
      production,
    );
    expect(single.robots).toEqual({ index: false, follow: true });
  });
});
