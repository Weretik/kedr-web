import { getCatalogTree } from '@site/catalog/data-access';
import { CATALOG_PATH, CATALOG_ROOTS } from '@site/catalog/model';
import { buildBreadcrumbListJsonLd } from '@site/catalog/seo';
import { Breadcrumbs, CategoryCards, ListingEmpty, getCatalogDictionary } from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';

/**
 * Catalog hub: hardware sections as photo cards, then doors with their own cards (like the former storefront
 * «Категорії» page); prerendered from the cached tree.
 */
export async function CatalogHubPage({ locale }: { locale: Locale }) {
  const dictionary = getCatalogDictionary(locale);
  const tree = await getCatalogTree(locale);
  const crumbs = [
    { name: dictionary.home, path: localizedPath(locale) },
    { name: dictionary.hubTitle, path: localizedPath(locale, CATALOG_PATH) },
  ];
  const hardware = tree?.filter((node) => node.id !== CATALOG_ROOTS.doorsId) ?? [];
  const doors = tree?.find((node) => node.id === CATALOG_ROOTS.doorsId);

  return (
    <div className="grid gap-8">
      <Breadcrumbs
        locale={locale}
        items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))}
      />
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">{dictionary.hubTitle}</h1>
        <p className="max-w-3xl text-muted-foreground">{dictionary.hubIntro}</p>
      </header>
      {tree?.length ? (
        <>
          <CategoryCards locale={locale} categories={hardware} priority />
          {doors && (
            <section aria-labelledby="hub-doors" className="grid gap-4">
              <h2 id="hub-doors" className="text-xl font-semibold tracking-tight">
                {doors.name}
              </h2>
              <CategoryCards
                locale={locale}
                categories={doors.children.length ? doors.children : [doors]}
              />
            </section>
          )}
        </>
      ) : (
        <ListingEmpty locale={locale} reason="unavailable" />
      )}
      <JsonLd data={buildBreadcrumbListJsonLd(crumbs)} />
    </div>
  );
}
