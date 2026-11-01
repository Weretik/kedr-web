import { createSiteConfig } from '@site/core/config';

import { buildBreadcrumbListJsonLd, buildProductItemListJsonLd } from './catalog-json-ld';

const config = createSiteConfig({ SITE_ENV: 'production' });

describe('catalog JSON-LD', () => {
  it('lists breadcrumbs with absolute URLs in order', () => {
    expect(
      buildBreadcrumbListJsonLd(
        [
          { name: 'Головна', path: '/uk' },
          { name: 'Ручки', path: '/uk/catalog/ruchky' },
        ],
        config,
      ),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://classkedr.com.ua/uk' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Ручки',
          item: 'https://classkedr.com.ua/uk/catalog/ruchky',
        },
      ],
    });
  });

  it('lists product page URLs of the listing', () => {
    const data = buildProductItemListJsonLd(
      'ru',
      [
        {
          id: 7,
          sku: 7,
          slug: 'zavisa-agb',
          name: 'Завіса',
          price: 1,
          photoUrl: null,
          inStock: true,
          isNew: false,
          isSale: false,
        },
      ],
      config,
    );

    expect(data['itemListElement']).toEqual([
      { '@type': 'ListItem', position: 1, url: 'https://classkedr.com.ua/ru/product/zavisa-agb' },
    ]);
  });
});
