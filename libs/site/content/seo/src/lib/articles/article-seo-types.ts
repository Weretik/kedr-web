/** Plain fields passed by the feature; SEO has no dependency on content model or data-access. */
export type ArticleSeoData = {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  publishedAt: string;
};

export type ArticlesSeoInput = {
  search: string;
  q: string;
  page: number;
  pageSize: number;
};
