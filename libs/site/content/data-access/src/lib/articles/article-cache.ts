/** Cache tags for site articles; the admin edits them, so entries live minutes, not hours. */
export const ARTICLE_CACHE_TAGS = {
  all: 'content',
  articles: 'content:articles',
  article: (slug: string) => `article:${slug}`,
} as const;

/** An admin edit reaches the site within ten minutes; a cached page is served while it refreshes. */
export const ARTICLE_LIFE = { stale: 300, revalidate: 600, expire: 86_400 };

// A failed read is cached briefly and retried in the background, but still prerendered (expire ≥ 5 minutes).
export const ARTICLE_FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3600 };
