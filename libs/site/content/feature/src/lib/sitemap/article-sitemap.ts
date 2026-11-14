import { getArticles } from '@site/content/data-access';
import { articlePath } from '@site/content/model';
import { DEFAULT_LOCALE } from '@site/core/i18n';

import type { SitemapPage } from '@site/core/seo';

/**
 * Published articles for the sitemap; slugs are the same in both languages. An unavailable API fails the
 * sitemap (5xx, crawlers retry) instead of publishing a list without articles.
 */
export async function getArticleSitemapPages(): Promise<SitemapPage[]> {
  const articles = await getArticles(DEFAULT_LOCALE);
  if (!articles) throw new Error('Articles are unavailable for the sitemap');
  return articles.map(({ slug }) => ({ path: articlePath(slug) }));
}
