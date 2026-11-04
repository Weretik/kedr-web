import { getCatalogSections } from '@site/catalog/data-access';
import { CATALOG_PATH, SEARCH_PATH } from '@site/catalog/model';
import { CatalogIndex } from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd, buildWebSiteJsonLd } from '@site/core/seo';
import {
  CatalogUnavailable,
  HomeCompany,
  HomeResults,
  HomeBrands,
  HomeFaq,
  getCompanyDictionary,
  HomeHero,
  HomeSection,
  WholesalePanel,
  getHomeDictionary,
} from '@site/home/ui';
import { getCompanyContacts } from '@site/shared/company';

import type { Locale } from '@site/core/i18n';

/**
 * Home page body: hero with search (desktop; phones use the header search), wholesale panel, catalog index, company and partner support, results, brands, and FAQ. Products are not shown here (owner decision 2026-11-01).
 * Catalog data is cached (`'use cache'`), so the whole page is part of the prerendered shell.
 */
export async function HomePage({ locale }: { locale: Locale }) {
  const dictionary = getHomeDictionary(locale);
  const companyDictionary = getCompanyDictionary(locale);
  const allProducts = localizedPath(locale, CATALOG_PATH);
  const [sections, { phone }] = await Promise.all([
    getCatalogSections(locale),
    getCompanyContacts(),
  ]);

  return (
    <>
      <div className="grid gap-8 py-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:py-10">
        <HomeHero
          locale={locale}
          dictionary={dictionary}
          searchAction={localizedPath(locale, SEARCH_PATH)}
        />
        <WholesalePanel locale={locale} dictionary={dictionary} phone={phone} />
      </div>

      <HomeSection
        id="home-catalog"
        title={dictionary.catalogTitle}
        action={{ href: allProducts, label: dictionary.catalogAll }}
      >
        {sections?.length ? (
          <CatalogIndex locale={locale} sections={sections} />
        ) : (
          <CatalogUnavailable
            text={dictionary.catalogUnavailable}
            href={allProducts}
            label={dictionary.catalogAll}
          />
        )}
      </HomeSection>

      <HomeCompany dictionary={companyDictionary} phone={phone} />
      <HomeResults dictionary={companyDictionary} />
      <HomeBrands dictionary={companyDictionary} />
      <HomeFaq dictionary={companyDictionary} phone={phone} />

      <JsonLd data={buildWebSiteJsonLd(locale)} />
    </>
  );
}
