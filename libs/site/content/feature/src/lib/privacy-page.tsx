import { getPrivacyDictionary } from '@site/content/model';
import { buildPrivacyBreadcrumbJsonLd } from '@site/content/seo';
import { PrivacyContent } from '@site/content/ui';
import { COMPANY, siteConfig } from '@site/core/config';
import { JsonLd } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';

/** Static local copy; environment and company facts are bound only at the server boundary. */
export function PrivacyPage({ locale }: { locale: Locale }) {
  const dictionary = getPrivacyDictionary(locale, {
    siteHost: new URL(siteConfig.siteUrl).host,
    email: COMPANY.email,
    phoneDisplay: COMPANY.phone.display,
    phoneHref: 'tel:' + COMPANY.phone.e164,
  });

  return (
    <>
      <PrivacyContent dictionary={dictionary} />
      <JsonLd data={buildPrivacyBreadcrumbJsonLd(locale)} />
    </>
  );
}
