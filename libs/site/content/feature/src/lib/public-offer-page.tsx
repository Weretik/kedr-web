import { getPublicOfferDictionary } from '@site/content/model';
import { buildPublicOfferBreadcrumbJsonLd } from '@site/content/seo';
import { PublicOfferContent } from '@site/content/ui';
import { JsonLd } from '@site/core/seo';
import { getCompanyContacts } from '@site/shared/company';

import type { Locale } from '@site/core/i18n';

/** Complete localized legal document; the layout owns the shared Organization graph. */
export async function PublicOfferPage({ locale }: { locale: Locale }) {
  const contacts = await getCompanyContacts();

  return (
    <>
      <PublicOfferContent dictionary={getPublicOfferDictionary(locale)} contacts={contacts} />
      <JsonLd data={buildPublicOfferBreadcrumbJsonLd(locale)} />
    </>
  );
}
