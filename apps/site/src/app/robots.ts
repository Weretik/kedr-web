import { siteConfig } from '@site/core/config';
import { buildRobotsFile } from '@site/core/seo';
import { PRODUCT_SITEMAP_INDEX_PATH } from '@site/product/feature';

import type { MetadataRoute } from 'next';

/** Static: robots.txt never reads the catalog, so an API failure cannot block crawling of the whole site. */
export default function robots(): MetadataRoute.Robots {
  return buildRobotsFile(siteConfig, [
    new URL(PRODUCT_SITEMAP_INDEX_PATH, siteConfig.siteUrl).href,
  ]);
}
