import { createSiteConfig } from '@site/core/config';

import { buildPageMetadata, buildRootMetadata } from './page-metadata';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const preview = createSiteConfig({ SITE_ENV: 'preview' });

describe('buildPageMetadata', () => {
  it('links both languages, x-default, and a self canonical', () => {
    const metadata = buildPageMetadata(
      { locale: 'ru', path: '/wholesale', title: 'Опт', description: 'Условия' },
      production,
    );

    expect(metadata.alternates).toEqual({
      canonical: '/ru/wholesale',
      languages: {
        'uk-UA': '/uk/wholesale',
        'ru-UA': '/ru/wholesale',
        'x-default': '/uk/wholesale',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      url: '/ru/wholesale',
      locale: 'ru_UA',
      alternateLocale: ['uk_UA'],
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('uses noindex, follow for non-indexable pages', () => {
    const metadata = buildPageMetadata(
      { locale: 'uk', path: '/checkout', title: 'Кошик', description: '', indexable: false },
      production,
    );

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it('blocks indexing everywhere until the site is allowed to be indexed', () => {
    const metadata = buildPageMetadata(
      { locale: 'uk', path: '/', title: 'Головна', description: '' },
      preview,
    );

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe('/uk');
  });
});

describe('buildRootMetadata', () => {
  it('sets the absolute URL base and the title template', () => {
    const metadata = buildRootMetadata('uk', production);

    expect(metadata.metadataBase?.toString()).toBe('https://classkedr.com.ua/');
    expect(metadata.title).toEqual({ default: 'Class Kedr', template: '%s | Class Kedr' });
  });
});
