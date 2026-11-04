import { createSiteConfig } from '@site/core/config';
import { DEFAULT_OG_IMAGE } from '@site/core/seo';

import { buildProductMetadata } from './product-metadata';
import { productSeoFixture as input } from '../../test/product-seo.fixture';

const production = createSiteConfig({
  SITE_ENV: 'production',
  SITE_INDEXING: 'true',
  SITE_URL: 'https://shop.example',
});

describe('product metadata', () => {
  it('omits an unconfirmed locale and retains the known current one', () => {
    const metadata = buildProductMetadata(input, production);
    expect(metadata.alternates).toEqual({
      canonical: 'https://shop.example/uk/product/handle-7',
      languages: {
        'uk-UA': 'https://shop.example/uk/product/handle-7',
        'x-default': 'https://shop.example/uk/product/handle-7',
      },
    });
    expect(metadata.robots).toMatchObject({ index: true });
  });

  it('uses the confirmed language paths rather than guessing translated slugs', () => {
    const metadata = buildProductMetadata(
      {
        ...input,
        locale: 'ru',
        path: '/product/handle-current',
        languagePaths: { uk: '/uk/product/ruchka', ru: '/ru/product/handle-current' },
      },
      production,
    );
    expect(metadata.alternates?.canonical).toBe('https://shop.example/ru/product/handle-current');
    expect(metadata.alternates?.languages).toMatchObject({
      'uk-UA': 'https://shop.example/uk/product/ruchka',
      'ru-UA': 'https://shop.example/ru/product/handle-current',
    });
    expect(metadata.openGraph).toMatchObject({
      locale: 'ru_UA',
      alternateLocale: ['uk_UA'],
      images: [{ url: input.images[0] }],
    });
    expect(metadata.title).toContain(input.sku);
  });

  it('does not create x-default and uses the shared preview without product photos', () => {
    const metadata = buildProductMetadata(
      { ...input, locale: 'ru', images: [], languagePaths: { ru: '/ru/product/handle-7' } },
      production,
    );
    expect(metadata.alternates?.languages).not.toHaveProperty('x-default');
    expect(metadata.openGraph).toMatchObject({ images: [DEFAULT_OG_IMAGE] });
    expect(metadata.twitter).toMatchObject({ card: 'summary' });
  });

  it('keeps preview noindex even when a product is otherwise indexable', () => {
    expect(
      buildProductMetadata(input, createSiteConfig({ SITE_ENV: 'preview', SITE_INDEXING: 'true' }))
        .robots,
    ).toMatchObject({ index: false, follow: false });
  });
});
