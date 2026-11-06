import { siteConfig } from '@site/core/config';

import { absoluteProductUrl, canonicalProductUrl } from '../urls/product-seo-urls';

import type { ProductGroupSeoInput } from '../inputs/product-group-seo-input';
import type { SiteConfig } from '@site/core/config';

const VARIES_BY = { color: 'https://schema.org/color', size: 'https://schema.org/size' } as const;

const isPrice = (price: number | null): price is number =>
  typeof price === 'number' && Number.isFinite(price) && price > 0;

/**
 * A model as a schema.org ProductGroup: its variants with their color and size, and one «від» offer for the group
 * (owner 2026-11-06: the lowest price only, no range and no per-variant prices).
 */
export function buildProductGroupJsonLd(
  input: ProductGroupSeoInput,
  config: SiteConfig = siteConfig,
): Record<string, unknown> {
  const url = canonicalProductUrl(input.page, config);
  const prices = input.variants.map((variant) => variant.price).filter(isPrice);
  const inStock = input.variants.some((variant) => variant.inStock);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    '@id': `${url}#product`,
    name: input.page.name,
    url,
    productGroupID: input.groupId,
    ...(input.page.description ? { description: input.page.description } : {}),
    ...(input.page.images.length ? { image: [...input.page.images] } : {}),
    ...(input.variesBy.length ? { variesBy: input.variesBy.map((code) => VARIES_BY[code]) } : {}),
    hasVariant: input.variants.map((variant) => ({
      '@type': 'Product',
      name: variant.name,
      sku: variant.sku,
      url: absoluteProductUrl(variant.path, config),
      ...(variant.image ? { image: variant.image } : {}),
      ...variant.properties,
    })),
    ...(prices.length
      ? {
          offers: {
            '@type': 'AggregateOffer',
            lowPrice: Math.min(...prices),
            priceCurrency: 'UAH',
            offerCount: prices.length,
            availability: `https://schema.org/${inStock ? 'InStock' : 'OutOfStock'}`,
          },
        }
      : {}),
  };
}
