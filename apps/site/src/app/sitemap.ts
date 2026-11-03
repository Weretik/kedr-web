import { getCatalogSitemapPages } from '@site/catalog/feature';
import { CONTENT_SITEMAP_PAGES } from '@site/content/feature';
import { buildSitemapEntries } from '@site/core/seo';

import type { MetadataRoute } from 'next';

/** Home, catalog hub, categories, and migrated content in both languages. Each migrated feature adds its own entries. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries([
    { path: '/' },
    ...(await getCatalogSitemapPages()),
    ...CONTENT_SITEMAP_PAGES,
  ]);
}
