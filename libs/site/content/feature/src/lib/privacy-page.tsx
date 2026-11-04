import { getPrivacyDictionary } from '@site/content/model';
import { buildPrivacyBreadcrumbJsonLd } from '@site/content/seo';
import { PrivacyContent } from '@site/content/ui';
import { siteConfig } from '@site/core/config';
import { JsonLd } from '@site/core/seo';
import { getCompanyContacts } from '@site/shared/company';

import type { Locale } from '@site/core/i18n';

/** Static local copy; the site host and the admin-edited contacts fill its placeholders on the server. */
export async function PrivacyPage({ locale }: { locale: Locale }) {
  const contacts = await getCompanyContacts();
  const dictionary = getPrivacyDictionary(locale, {
    siteHost: new URL(siteConfig.siteUrl).host,
    email: contacts.email,
    phoneDisplay: contacts.phone.display,
    phoneHref: 'tel:' + contacts.phone.e164,
  });

  return (
    <>
      <PrivacyContent dictionary={dictionary} />
      <JsonLd data={buildPrivacyBreadcrumbJsonLd(locale)} />
    </>
  );
}
