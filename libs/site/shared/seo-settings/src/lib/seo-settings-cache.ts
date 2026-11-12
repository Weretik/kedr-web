/** Cache tags of the SEO settings; «Оновити сайт зараз» drops `content`, so a change can show at once. */
export const SEO_SETTINGS_CACHE_TAGS = {
  all: 'content',
  settings: 'content:seo-settings',
} as const;

/** An admin edit reaches the site within ten minutes; a cached page is served while it refreshes. */
export const SEO_SETTINGS_LIFE = { stale: 300, revalidate: 600, expire: 86_400 };

// A failed read adds no codes for a minute and is retried in the background.
export const SEO_SETTINGS_FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3600 };
