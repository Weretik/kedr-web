import { getContactsDictionary } from '@site/content/model';
import { buildContactsBreadcrumbJsonLd } from '@site/content/seo';
import { ContactsContent } from '@site/content/ui';
import { JsonLd, buildLocalBusinessJsonLd } from '@site/core/seo';
import { getCompanyContacts } from '@site/shared/company';

import type { ContactsDetails } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/**
 * Server-rendered contacts: the same admin-edited contacts as the site shell and organization metadata, plus the
 * shop as a local business once its street is filled in.
 */
export async function ContactsPage({ locale }: { locale: Locale }) {
  const contacts = await getCompanyContacts();
  const details: ContactsDetails = {
    phone: contacts.phone,
    email: contacts.email,
    city: contacts.city[locale],
    ...contacts.links,
  };
  const store = buildLocalBusinessJsonLd(locale, contacts);

  return (
    <>
      <ContactsContent dictionary={getContactsDictionary(locale)} details={details} />
      <JsonLd data={buildContactsBreadcrumbJsonLd(locale)} />
      {store ? <JsonLd data={store} /> : null}
    </>
  );
}
