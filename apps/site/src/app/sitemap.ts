import { buildSitemapEntries } from '@site/core/seo';

import type { MetadataRoute } from 'next';

/** Shell sitemap: only the home page. Each migrated feature adds its own entries (see the migration plan). */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries([{ path: '/' }]);
}
