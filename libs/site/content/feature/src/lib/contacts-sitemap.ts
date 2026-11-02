import { CONTACTS_PATH } from '@site/content/seo';

import type { SitemapPage } from '@site/core/seo';

export function getContactsSitemapPages(): SitemapPage[] {
  return [{ path: CONTACTS_PATH }];
}
