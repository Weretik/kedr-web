import { getPublicOfferDictionary } from '@site/content/model';
import { buildPublicOfferBreadcrumbJsonLd } from '@site/content/seo';
import { PublicOfferContent } from '@site/content/ui';
import { JsonLd } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';

/** Complete localized legal document; the layout owns the shared Organization graph. */
export function PublicOfferPage({ locale }: { locale: Locale }) {
  return (
    <>
      <PublicOfferContent dictionary={getPublicOfferDictionary(locale)} />
      <JsonLd data={buildPublicOfferBreadcrumbJsonLd(locale)} />
    </>
  );
}
