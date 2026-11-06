import { createSiteConfig } from '@site/core/config';

import { buildProductGroupJsonLd } from './product-group-json-ld';
import { productSeoFixture } from '../../test/product-seo.fixture';

import type { ProductGroupSeoInput } from '../inputs/product-group-seo-input';

const config = createSiteConfig({ SITE_URL: 'https://shop.example' });

const input: ProductGroupSeoInput = {
  page: { ...productSeoFixture, path: '/product/zavisa-flush', name: 'Завіса FLUSH' },
  groupId: 'zavisa-flush',
  variesBy: ['color'],
  variants: [
    {
      name: 'Завіса FLUSH хром',
      sku: '1',
      path: '/uk/product/zavisa-flush?kolir=khrom',
      image: null,
      price: 78.4,
      inStock: false,
      properties: { color: 'Хром' },
    },
    {
      name: 'Завіса FLUSH золото',
      sku: '2',
      path: '/uk/product/zavisa-flush?kolir=zoloto',
      image: 'https://images-kedr.cdn.express/2.jpg',
      price: 65.7,
      inStock: true,
      properties: { color: 'Золото' },
    },
  ],
};

describe('model ProductGroup structured data', () => {
  it('lists every variant with its color and a «від» offer only', () => {
    const data = buildProductGroupJsonLd(input, config);

    expect(data).toMatchObject({
      '@type': 'ProductGroup',
      url: 'https://shop.example/uk/product/zavisa-flush',
      productGroupID: 'zavisa-flush',
      variesBy: ['https://schema.org/color'],
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: 65.7,
        priceCurrency: 'UAH',
        offerCount: 2,
        availability: 'https://schema.org/InStock',
      },
    });
    expect(data['offers']).not.toHaveProperty('highPrice');
    expect(data['hasVariant']).toEqual([
      {
        '@type': 'Product',
        name: 'Завіса FLUSH хром',
        sku: '1',
        url: 'https://shop.example/uk/product/zavisa-flush?kolir=khrom',
        color: 'Хром',
      },
      {
        '@type': 'Product',
        name: 'Завіса FLUSH золото',
        sku: '2',
        url: 'https://shop.example/uk/product/zavisa-flush?kolir=zoloto',
        image: 'https://images-kedr.cdn.express/2.jpg',
        color: 'Золото',
      },
    ]);
  });

  it('does not invent an offer without prices', () => {
    const data = buildProductGroupJsonLd(
      { ...input, variants: input.variants.map((variant) => ({ ...variant, price: null })) },
      config,
    );
    expect(data).not.toHaveProperty('offers');
  });
});
