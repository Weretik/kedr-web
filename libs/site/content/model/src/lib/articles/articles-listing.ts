import { articlePlainText } from './article-text';
import { normalizeArticleSearch, parseArticlesQuery } from './articles-query';

import type { Article, ArticlesListing, ArticlesQuery } from './article-types';

/** Filter the entire source first, then page; never mutate the original records. */
export function buildArticlesListing(
  articles: readonly Article[],
  query: ArticlesQuery,
): ArticlesListing {
  const normalized = parseArticlesQuery({
    q: query.q,
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  const term = normalized.q.toLocaleLowerCase();
  const found = term
    ? articles.filter((article) =>
        normalizeArticleSearch(
          [article.title, article.excerpt, articlePlainText(article.bodyHtml)].join(' '),
        )
          .toLocaleLowerCase()
          .includes(term),
      )
    : articles;
  const total = found.length;
  const pageCount = Math.ceil(total / normalized.pageSize);
  const page = Math.min(normalized.page, Math.max(1, pageCount));
  const offset = (page - 1) * normalized.pageSize;
  return {
    items: found.slice(offset, offset + normalized.pageSize),
    query: { ...normalized, page },
    total,
    pageCount,
    start: total === 0 ? 0 : offset + 1,
    end: Math.min(offset + normalized.pageSize, total),
  };
}
