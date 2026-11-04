import type { LegalDocumentKind } from '@site/content/model';

/** Cache tags of the site documents; the admin publishes editions, so entries live minutes, not hours. */
export const LEGAL_DOCUMENT_CACHE_TAGS = {
  all: 'content',
  documents: 'content:documents',
  document: (kind: LegalDocumentKind) => `content:document:${kind}`,
} as const;

/** A published edition reaches the site within ten minutes; a cached page is served while it refreshes. */
export const LEGAL_DOCUMENT_LIFE = { stale: 300, revalidate: 600, expire: 86_400 };

// A failed read is cached briefly and retried in the background, but still prerendered (expire ≥ 5 minutes).
export const LEGAL_DOCUMENT_FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3600 };
