import { siteConfig } from '@site/core/config';

import { buildOffer } from './offer-terms';
import { canonicalProductUrl } from '../urls/product-seo-urls';

import type { ProductSeoInput } from '../inputs/product-seo-input';
import type { SiteConfig } from '@site/core/config';

export function buildProductJsonLd(
  input: ProductSeoInput,
  config: SiteConfig = siteConfig,
): Record<string, unknown> {
  const url = canonicalProductUrl(input, config);
  const offer = buildOffer(input.locale, url, input.price, input.inStock, config);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: input.name,
    sku: input.sku,
    url,
    // Only a text written for the site (model «Вітрина сайту»); the generated meta text is not a description.
    ...(input.description ? { description: input.description } : {}),
    ...(input.images.length ? { image: [...input.images] } : {}),
    ...(offer ? { offers: offer } : {}),
  };
}
