import { getPublicOfferDictionary } from '@site/content/model';
import { buildPublicOfferBreadcrumbJsonLd } from '@site/content/seo';
import { PublicOfferContent } from '@site/content/ui';
import { JsonLd } from '@site/core/seo';
import { getCompanyContacts } from '@site/shared/company';

import { loadLegalDocument } from '../documents/load-legal-document';

import type { Locale } from '@site/core/i18n';

/** The published offer edition in the page chrome; the layout owns the shared Organization graph. */
export async function PublicOfferPage({ locale }: { locale: Locale }) {
  const contacts = await getCompanyContacts();
  const document = await loadLegalDocument(locale, 'public-offer', contacts, 'offer');

  return (
    <>
      <PublicOfferContent
        dictionary={getPublicOfferDictionary(locale)}
        document={document}
        contacts={contacts}
      />
      <JsonLd data={buildPublicOfferBreadcrumbJsonLd(locale)} />
    </>
  );
}
