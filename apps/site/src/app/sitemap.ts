import { getCatalogSitemapPages } from '@site/catalog/feature';
import { getContactsSitemapPages } from '@site/content/feature';
import { buildSitemapEntries } from '@site/core/seo';

import type { MetadataRoute } from 'next';

/** Home, catalog, categories, and contacts in both languages. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries([
    { path: '/' },
    ...(await getCatalogSitemapPages()),
    ...getContactsSitemapPages(),
  ]);
}
