import { siteConfig } from '@site/core/config';
import { buildRobotsFile } from '@site/core/seo';
import { getProductSitemapUrls } from '@site/product/feature';

import type { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Preview stays closed and does not enumerate the product feed.
  const products = siteConfig.indexingEnabled ? await getProductSitemapUrls() : [];
  return buildRobotsFile(siteConfig, products);
}
