import { getPrivacyDictionary } from '@site/content/model';
import { buildPrivacyBreadcrumbJsonLd } from '@site/content/seo';
import { PrivacyContent } from '@site/content/ui';
import { JsonLd } from '@site/core/seo';
import { getCompanyContacts } from '@site/shared/company';

import { loadLegalDocument } from './documents/load-legal-document';

import type { Locale } from '@site/core/i18n';

/** The published policy edition; the site host and the admin-edited contacts fill its placeholders. */
export async function PrivacyPage({ locale }: { locale: Locale }) {
  const contacts = await getCompanyContacts();
  const document = await loadLegalDocument(locale, 'privacy-policy', contacts, 'privacy');
  const dictionary = getPrivacyDictionary(locale, {
    email: contacts.email,
    phoneDisplay: contacts.phone.display,
    phoneHref: 'tel:' + contacts.phone.e164,
  });

  return (
    <>
      <PrivacyContent dictionary={dictionary} document={document} />
      <JsonLd data={buildPrivacyBreadcrumbJsonLd(locale)} />
    </>
  );
}
