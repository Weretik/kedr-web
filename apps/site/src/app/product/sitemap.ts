import { getProductSitemap, getProductSitemapIds } from '@site/product/feature';

import type { MetadataRoute } from 'next';

export const generateSitemaps = getProductSitemapIds;

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  return getProductSitemap(await id);
}
