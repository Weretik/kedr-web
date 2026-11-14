import type { ArticleSummary } from '../entities/article';

/** Which articles the list shows: all, only those on the site, or only drafts. */
export type ArticlePublicationFilter = 'all' | 'published' | 'draft';

export function filterArticlesByPublication(
  articles: readonly ArticleSummary[],
  filter: ArticlePublicationFilter,
): ArticleSummary[] {
  if (filter === 'all') return [...articles];
  const published = filter === 'published';
  return articles.filter((article) => article.isPublished === published);
}
