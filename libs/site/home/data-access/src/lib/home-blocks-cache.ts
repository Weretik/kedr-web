/** Cache tags of the home page blocks; the admin edits them, so entries live minutes, not hours. */
export const HOME_BLOCKS_CACHE_TAGS = {
  all: 'content',
  home: 'content:home',
} as const;

/** An admin edit reaches the site within ten minutes; a cached page is served while it refreshes. */
export const HOME_BLOCKS_LIFE = { stale: 300, revalidate: 600, expire: 86_400 };

// A failed read falls back to the code texts for a minute and is retried in the background.
export const HOME_BLOCKS_FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3600 };
