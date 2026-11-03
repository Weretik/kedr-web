import { siteConfig } from '@site/core/config';

import { canonicalProductUrl } from '../urls/product-seo-urls';

import type { ProductSeoInput } from '../inputs/product-seo-input';
import type { SiteConfig } from '@site/core/config';

export function buildProductJsonLd(
  input: ProductSeoInput,
  config: SiteConfig = siteConfig,
): Record<string, unknown> {
  const url = canonicalProductUrl(input, config);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: input.name,
    sku: input.sku,
    url,
    ...(input.images.length ? { image: [...input.images] } : {}),
    ...(typeof input.price === 'number' && Number.isFinite(input.price) && input.price > 0
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price: input.price,
            priceCurrency: 'UAH',
            availability: `https://schema.org/${input.inStock ? 'InStock' : 'OutOfStock'}`,
          },
        }
      : {}),
  };
}
