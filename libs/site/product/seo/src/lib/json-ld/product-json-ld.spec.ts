import { createSiteConfig } from '@site/core/config';
import { serializeJsonLd } from '@site/core/seo';

import { buildProductBreadcrumbJsonLd } from './product-breadcrumb-json-ld';
import { buildProductJsonLd } from './product-json-ld';
import { productSeoFixture as input } from '../../test/product-seo.fixture';

const config = createSiteConfig({ SITE_URL: 'https://shop.example' });

describe('product structured data', () => {
  it('exposes the visible real price and availability as an Offer', () => {
    expect(buildProductJsonLd(input, config)).toMatchObject({
      '@id': 'https://shop.example/uk/product/handle-7#product',
      sku: '7',
      offers: {
        price: 245.5,
        priceCurrency: 'UAH',
        availability: 'https://schema.org/InStock',
        url: 'https://shop.example/uk/product/handle-7',
      },
    });
  });

  it('keeps a known price while marking an unavailable product OutOfStock', () => {
    expect(buildProductJsonLd({ ...input, inStock: false }, config)).toMatchObject({
      offers: { price: 245.5, availability: 'https://schema.org/OutOfStock' },
    });
  });

  it('does not invent an Offer or product characteristics', () => {
    for (const price of [null, 0, -1, Number.NaN]) {
      const data = buildProductJsonLd({ ...input, price, images: [] }, config);
      for (const field of ['offers', 'image', 'brand', 'description', 'aggregateRating', 'review'])
        expect(data).not.toHaveProperty(field);
    }
  });

  it('uses the exact visible breadcrumb trail with absolute URLs', () => {
    expect(buildProductBreadcrumbJsonLd(input, config).itemListElement).toEqual(
      input.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `https://shop.example${crumb.path}`,
      })),
    );
  });

  it('keeps product names safe when passed to the existing renderer', () => {
    const payload = '</script><img src=x onerror=alert(1)>';
    const encoded = serializeJsonLd(buildProductJsonLd({ ...input, name: payload }, config));
    expect(encoded).not.toContain('<');
    expect(JSON.parse(encoded).name).toBe(payload);
  });
});
