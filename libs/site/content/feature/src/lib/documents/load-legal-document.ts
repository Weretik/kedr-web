import { getLegalDocument } from '@site/content/data-access';
import { buildLegalDocument } from '@site/content/model';
import { siteConfig } from '@site/core/config';
import { notFound } from 'next/navigation';

import type { LegalDocument, LegalDocumentKind } from '@site/content/model';
import type { CompanyContacts } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/**
 * The published edition with the site host and saved contacts filled in. Nothing published is a 404; an API
 * failure is an error, so a legal page is never served empty.
 */
export async function loadLegalDocument(
  locale: Locale,
  kind: LegalDocumentKind,
  contacts: Pick<CompanyContacts, 'email' | 'phone'>,
  idPrefix: string,
): Promise<LegalDocument> {
  const result = await getLegalDocument(locale, kind);
  if (result.kind === 'not-found') notFound();
  if (result.kind === 'unavailable') throw new Error('Content API is unavailable');

  return buildLegalDocument(
    result.document,
    locale,
    {
      siteHost: new URL(siteConfig.siteUrl).host,
      email: contacts.email,
      phoneDisplay: contacts.phone.display,
      phoneHref: 'tel:' + contacts.phone.e164,
    },
    idPrefix,
  );
}
