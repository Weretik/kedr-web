import { ARTICLE_SLUGS, articlePath } from '@site/content/model';

/** Public content routes; core/seo expands these descriptors into both language versions. */
export const CONTENT_SITEMAP_PAGES = [
  { path: '/delivery-and-payment' },
  { path: '/returns-exchanges' },
  { path: '/contacts' },
  { path: '/wholesale' },
  { path: '/articles' },
  ...Object.values(ARTICLE_SLUGS).map((slug) => ({ path: articlePath(slug) })),
] as const;
