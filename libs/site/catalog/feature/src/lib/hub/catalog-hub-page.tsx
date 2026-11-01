import { getCatalogSections } from '@site/catalog/data-access';
import { CATALOG_PATH } from '@site/catalog/model';
import { buildBreadcrumbListJsonLd } from '@site/catalog/seo';
import { Breadcrumbs, CatalogIndex, ListingEmpty, getCatalogDictionary } from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';

/** Catalog hub: every section with its subcategories; prerendered from the cached tree. */
export async function CatalogHubPage({ locale }: { locale: Locale }) {
  const dictionary = getCatalogDictionary(locale);
  const sections = await getCatalogSections(locale);
  const crumbs = [
    { name: dictionary.home, path: localizedPath(locale) },
    { name: dictionary.hubTitle, path: localizedPath(locale, CATALOG_PATH) },
  ];

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        locale={locale}
        items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))}
      />
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">{dictionary.hubTitle}</h1>
        <p className="max-w-3xl text-muted-foreground">{dictionary.hubIntro}</p>
      </header>
      {sections?.length ? (
        <CatalogIndex locale={locale} sections={sections} />
      ) : (
        <ListingEmpty locale={locale} reason="unavailable" />
      )}
      <JsonLd data={buildBreadcrumbListJsonLd(crumbs)} />
    </div>
  );
}
