import { getCatalogTree } from '@site/catalog/data-access';
import { CATALOG_PATH, CATALOG_ROOTS } from '@site/catalog/model';
import { CategoryCards } from '@site/catalog/ui';
import { getWholesaleDictionary } from '@site/content/model';
import { buildWholesaleBreadcrumbJsonLd } from '@site/content/seo';
import { WholesaleContent } from '@site/content/ui';
import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';

import type { WholesaleCompanyDetails } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** Server-rendered wholesale offer with real catalog sections and manager contact. */
export async function WholesalePage({ locale }: { locale: Locale }) {
  const tree = await getCatalogTree(locale);
  const categories = tree?.filter((category) => category.id !== CATALOG_ROOTS.doorsId) ?? [];
  const details: WholesaleCompanyDetails = {
    name: COMPANY.name,
    phone: COMPANY.phone,
    city: COMPANY.address.city[locale],
    telegram: COMPANY.links.telegram,
    viber: COMPANY.links.viber,
  };

  return (
    <>
      <WholesaleContent
        dictionary={getWholesaleDictionary(locale)}
        details={details}
        assortment={
          categories.length ? (
            <CategoryCards locale={locale} categories={categories} variant="compact" />
          ) : null
        }
        links={{
          home: localizedPath(locale, '/'),
          catalog: localizedPath(locale, CATALOG_PATH),
          company: `${localizedPath(locale, '/')}#about-company`,
          delivery: localizedPath(locale, '/delivery-and-payment'),
          returns: localizedPath(locale, '/returns-exchanges'),
        }}
      />
      <JsonLd data={buildWholesaleBreadcrumbJsonLd(locale)} />
    </>
  );
}
