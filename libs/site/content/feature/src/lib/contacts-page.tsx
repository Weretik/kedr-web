import { getContactsDictionary } from '@site/content/model';
import { buildContactsBreadcrumbJsonLd } from '@site/content/seo';
import { ContactsContent } from '@site/content/ui';
import { JsonLd } from '@site/core/seo';
import { getCompanyContacts } from '@site/shared/company';

import type { ContactsDetails } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** Server-rendered contacts: the same admin-edited contacts as the site shell and organization metadata. */
export async function ContactsPage({ locale }: { locale: Locale }) {
  const contacts = await getCompanyContacts();
  const details: ContactsDetails = {
    phone: contacts.phone,
    email: contacts.email,
    city: contacts.city[locale],
    ...contacts.links,
  };

  return (
    <>
      <ContactsContent dictionary={getContactsDictionary(locale)} details={details} />
      <JsonLd data={buildContactsBreadcrumbJsonLd(locale)} />
    </>
  );
}
