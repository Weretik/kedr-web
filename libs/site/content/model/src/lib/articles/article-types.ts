/** Public content model. Full texts remain on the server; client controls receive only query choices. */
export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  paragraphs: readonly string[];
  image: string | null;
  publishedAt: string;
};

export const ARTICLE_PAGE_SIZES = [10, 20, 50] as const;
export type ArticlesPageSize = (typeof ARTICLE_PAGE_SIZES)[number];
export type ArticlesQuery = { q: string; page: number; pageSize: ArticlesPageSize };
export type ArticlesSearchParams = Record<string, string | string[] | undefined>;
export type ArticlesListing = {
  items: readonly Article[];
  query: ArticlesQuery;
  total: number;
  pageCount: number;
  start: number;
  end: number;
};
export const DEFAULT_ARTICLES_QUERY: ArticlesQuery = { q: '', page: 1, pageSize: 10 };
