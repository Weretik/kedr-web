/** Cache tags of the company contacts; the admin edits them, so entries live minutes, not hours. */
export const COMPANY_CONTACTS_CACHE_TAGS = {
  all: 'content',
  contacts: 'content:contacts',
} as const;

/** An admin edit reaches the site within ten minutes; a cached page is served while it refreshes. */
export const COMPANY_CONTACTS_LIFE = { stale: 300, revalidate: 600, expire: 86_400 };

// A failed read falls back to the code values for a minute and is retried in the background.
export const COMPANY_CONTACTS_FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3600 };
