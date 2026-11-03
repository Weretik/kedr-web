import { getContactsDictionary } from '@site/content/model';
import { buildContactsBreadcrumbJsonLd } from '@site/content/seo';
import { ContactsContent } from '@site/content/ui';
import { COMPANY } from '@site/core/config';
import { JsonLd } from '@site/core/seo';

import type { ContactsDetails } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** Server-rendered contacts share company facts with the site shell and organization metadata. */
export function ContactsPage({ locale }: { locale: Locale }) {
  const details: ContactsDetails = {
    phone: COMPANY.phone,
    email: COMPANY.email,
    city: COMPANY.address.city[locale],
    ...COMPANY.links,
  };

  return (
    <>
      <ContactsContent dictionary={getContactsDictionary(locale)} details={details} />
      <JsonLd data={buildContactsBreadcrumbJsonLd(locale)} />
    </>
  );
}
