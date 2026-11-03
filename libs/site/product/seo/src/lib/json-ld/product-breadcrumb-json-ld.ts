import { siteConfig } from '@site/core/config';

import { absoluteProductUrl, canonicalProductUrl } from '../urls/product-seo-urls';

import type { ProductSeoInput } from '../inputs/product-seo-input';
import type { SiteConfig } from '@site/core/config';

/** Input is the same visible trail used by the server-rendered page. */
export function buildProductBreadcrumbJsonLd(
  input: ProductSeoInput,
  config: SiteConfig = siteConfig,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonicalProductUrl(input, config)}#breadcrumb`,
    itemListElement: input.breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteProductUrl(crumb.path, config),
    })),
  };
}
