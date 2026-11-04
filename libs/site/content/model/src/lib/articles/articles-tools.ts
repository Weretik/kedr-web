import { DEFAULT_ARTICLES_QUERY } from './article-types';

import type { ArticlesListing } from './article-types';

/** Below this many articles every one fits on one screen, so search, page size, and paging are noise. */
export const ARTICLES_TOOLS_MIN_TOTAL = 20;

/**
 * Whether the list shows search, page size, and paging. They stay visible for any chosen search, page, or size,
 * so a shared or bookmarked URL keeps its controls and a way back.
 */
export function showArticlesTools({ total, query }: Pick<ArticlesListing, 'total' | 'query'>) {
  const chosen =
    query.q !== DEFAULT_ARTICLES_QUERY.q ||
    query.page !== DEFAULT_ARTICLES_QUERY.page ||
    query.pageSize !== DEFAULT_ARTICLES_QUERY.pageSize;
  return chosen || total >= ARTICLES_TOOLS_MIN_TOTAL;
}
