import { COMPANY, siteConfig } from '@site/core/config';

import { buildOffer } from './offer-terms';
import { absoluteProductUrl, canonicalProductUrl } from '../urls/product-seo-urls';

import type { ProductGroupSeoInput } from '../inputs/product-group-seo-input';
import type { SiteConfig } from '@site/core/config';

const VARIES_BY = { color: 'https://schema.org/color', size: 'https://schema.org/size' } as const;

const isPrice = (price: number | null): price is number =>
  typeof price === 'number' && Number.isFinite(price) && price > 0;

/**
 * A model as a schema.org ProductGroup: its variants with their color, size, and own Offer (Google reads prices
 * of a product group from its variants), plus the visible «від» offer for the group (owner 2026-11-06: the page
 * shows the lowest price only; owner 2026-11-17: each variant carries its price in the markup).
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
    brand: { '@type': 'Brand', name: COMPANY.name },
    ...(input.page.description ? { description: input.page.description } : {}),
    ...(input.page.images.length ? { image: [...input.page.images] } : {}),
    ...(input.variesBy.length ? { variesBy: input.variesBy.map((code) => VARIES_BY[code]) } : {}),
    hasVariant: input.variants.map((variant) => {
      const variantUrl = absoluteProductUrl(variant.path, config);
      const offer = buildOffer(
        input.page.locale,
        variantUrl,
        variant.price,
        variant.inStock,
        config,
      );
      return {
        '@type': 'Product',
        name: variant.name,
        sku: variant.sku,
        url: variantUrl,
        ...(variant.image ? { image: variant.image } : {}),
        ...variant.properties,
        ...(offer ? { offers: offer } : {}),
      };
    }),
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
