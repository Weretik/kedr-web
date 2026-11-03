import { siteConfig } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';

import type { ProductSeoInput } from '../inputs/product-seo-input';
import type { SiteConfig } from '@site/core/config';

export const absoluteProductUrl = (path: string, config: SiteConfig = siteConfig): string =>
  new URL(path, config.siteUrl).href;

export const canonicalProductUrl = (
  input: ProductSeoInput,
  config: SiteConfig = siteConfig,
): string => absoluteProductUrl(localizedPath(input.locale, input.path), config);
