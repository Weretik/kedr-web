/** Cache tags of the «Співпраця» texts; managers edit them in the admin, so entries live minutes, not hours. */
export const WHOLESALE_CACHE_TAGS = {
  all: 'content',
  wholesale: 'content:wholesale',
} as const;

/** A change reaches the site within ten minutes; a cached page is served while it refreshes. */
export const WHOLESALE_LIFE = { stale: 300, revalidate: 600, expire: 86_400 };

// A failed read is cached briefly and retried in the background, but still prerendered (expire ≥ 5 minutes).
export const WHOLESALE_FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3600 };
