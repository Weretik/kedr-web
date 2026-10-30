import { getCatalogSections, getInStockProducts } from '@site/catalog/data-access';
import { ALL_PRODUCTS_PATH } from '@site/catalog/model';
import { CatalogIndex, ProductGrid } from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd, buildWebSiteJsonLd } from '@site/core/seo';
import {
  CatalogUnavailable,
  HomeFacts,
  HomeHero,
  HomeSection,
  WholesalePanel,
  getHomeDictionary,
} from '@site/home/ui';

import type { Locale } from '@site/core/i18n';

/**
 * Home page body: hero with search, wholesale panel, catalog index, products in stock, and facts.
 * Catalog data is cached (`'use cache'`), so the whole page is part of the prerendered shell.
 */
export async function HomePage({ locale }: { locale: Locale }) {
  const dictionary = getHomeDictionary(locale);
  const allProducts = localizedPath(locale, ALL_PRODUCTS_PATH);
  const [sections, products] = await Promise.all([
    getCatalogSections(locale),
    getInStockProducts(locale),
  ]);

  return (
    <>
      <div className="grid gap-8 py-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:py-10">
        <HomeHero locale={locale} dictionary={dictionary} searchAction={allProducts} />
        <WholesalePanel locale={locale} dictionary={dictionary} />
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

      {products?.length ? (
        <HomeSection
          id="home-in-stock"
          title={dictionary.inStockTitle}
          action={{ href: allProducts, label: dictionary.inStockAll }}
        >
          <ProductGrid locale={locale} products={products} />
        </HomeSection>
      ) : null}

      <HomeSection id="home-facts" title={dictionary.factsTitle}>
        <HomeFacts dictionary={dictionary} />
      </HomeSection>

      <JsonLd data={buildWebSiteJsonLd(locale)} />
    </>
  );
}
