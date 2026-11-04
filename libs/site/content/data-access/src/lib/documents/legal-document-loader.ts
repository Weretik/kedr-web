import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import {
  LEGAL_DOCUMENT_CACHE_TAGS,
  LEGAL_DOCUMENT_FAILURE_LIFE,
  LEGAL_DOCUMENT_LIFE,
} from './legal-document-cache';

import type { LegalDocumentKind, LegalDocumentSource } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** One document read: the published edition, nothing published, or an API failure. */
export type LegalDocumentResult =
  { kind: 'ok'; document: LegalDocumentSource } | { kind: 'not-found' } | { kind: 'unavailable' };

/** The published edition of a site document in one language, with its placeholders still in place. */
export async function getLegalDocument(
  locale: Locale,
  documentKind: LegalDocumentKind,
): Promise<LegalDocumentResult> {
  'use cache';
  cacheTag(
    LEGAL_DOCUMENT_CACHE_TAGS.all,
    LEGAL_DOCUMENT_CACHE_TAGS.documents,
    LEGAL_DOCUMENT_CACHE_TAGS.document(documentKind),
  );

  const result = await siteApiGet('/api/content/{lang}/documents/{kind}', {
    path: { lang: locale, kind: documentKind },
  });
  if (result.kind === 'ok') {
    cacheLife(LEGAL_DOCUMENT_LIFE);
    const { kind, number, effectiveFrom, title, bodyHtml } = result.data;
    return { kind: 'ok', document: { kind, number, effectiveFrom, title, bodyHtml } };
  }
  if (result.kind === 'not-found' || result.kind === 'gone') {
    cacheLife(LEGAL_DOCUMENT_LIFE);
    return { kind: 'not-found' };
  }

  cacheLife(LEGAL_DOCUMENT_FAILURE_LIFE);
  return { kind: 'unavailable' };
}
