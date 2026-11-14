import { ARTICLE_PAGE_SIZES, DEFAULT_ARTICLES_QUERY } from '../entities/article-types';

import type {
  ArticlesPageSize,
  ArticlesQuery,
  ArticlesSearchParams,
} from '../entities/article-types';

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** Same normalization for URL input and the full-text search haystack. */
export function normalizeArticleSearch(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ');
}

/** Query state is bounded and independent of the product catalog. */
export function parseArticlesQuery(params: ArticlesSearchParams): ArticlesQuery {
  const rawPage = first(params['page']) ?? '';
  const page = /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : 1;
  const size = Number(first(params['pageSize']));
  return {
    q: normalizeArticleSearch(first(params['q']) ?? '').slice(0, 200),
    page: Number.isSafeInteger(page) ? page : 1,
    pageSize: ARTICLE_PAGE_SIZES.includes(size as ArticlesPageSize)
      ? (size as ArticlesPageSize)
      : DEFAULT_ARTICLES_QUERY.pageSize,
  };
}

/** Defaults are omitted so the same choices produce the same canonical query. */
export function serializeArticlesQuery(query: ArticlesQuery): string {
  const normalized = parseArticlesQuery({
    q: query.q,
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  const params = new URLSearchParams();
  if (normalized.q) params.set('q', normalized.q);
  if (normalized.pageSize !== 10) params.set('pageSize', String(normalized.pageSize));
  if (normalized.page !== 1) params.set('page', String(normalized.page));
  return params.toString();
}

export function articlesHref(path: string, query: ArticlesQuery): string {
  const search = serializeArticlesQuery(query);
  return search ? path + '?' + search : path;
}
