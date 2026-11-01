import { getCatalogSitemapPages } from '@site/catalog/feature';
import { buildSitemapEntries } from '@site/core/seo';

import type { MetadataRoute } from 'next';

/** Home, catalog hub, and every category in both languages. Each migrated feature adds its own entries. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries([{ path: '/' }, ...(await getCatalogSitemapPages())]);
}
