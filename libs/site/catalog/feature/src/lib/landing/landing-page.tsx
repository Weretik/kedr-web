import { getCatalogTree } from '@site/catalog/data-access';
import { categoryPath, findLanding, landingHeading, landingPath } from '@site/catalog/model';
import { buildBreadcrumbListJsonLd, categorySubject } from '@site/catalog/seo';
import { Breadcrumbs, CategoryHeader, getCatalogDictionary } from '@site/catalog/ui';
import { localizedPath, pluralize } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { categoryChips } from '../category/category-chips';
import { categoryCrumbs } from '../category/category-crumbs';
import { loadBaseListing, loadCategoryOrRespond } from '../category/category-loading';
import { ListingSkeleton } from '../listing/listing-skeleton';
import { ProductListing } from '../listing/product-listing';

import type { RenderListingPurchaseAction } from '../listing/listing-purchase';
import type { CategoryDetails, ListingLanding, SearchParamsRecord } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type LoadedLanding = { category: CategoryDetails; landing: ListingLanding };

type CategoryValuePageProps = {
  locale: Locale;
  slug: string;
  value: string;
  searchParams: Promise<SearchParamsRecord>;
  renderPurchaseAction?: RenderListingPurchaseAction;
};

/**
 * Loads a value page before anything streams: a moved category answers 308 to its new value page; a category
 * with subcategories or an unknown value answers 404; an unavailable API throws (500).
 */
export async function loadLandingOrRespond(
  locale: Locale,
  slug: string,
  value: string,
  searchParams?: Promise<SearchParamsRecord>,
): Promise<LoadedLanding> {
  const category = await loadCategoryOrRespond(locale, slug, searchParams, value);
  if (category.children.length) notFound();
  const base = await loadBaseListing(locale, category);
  if (!base) throw new Error(`Catalog API is unavailable for the list of "${slug}"`);
  const landing = findLanding(base.filters, value);
  if (!landing) notFound();
  return { category, landing };
}

/**
 * A value page of a final category, «Завіси хром» (spec site/product/002 stage 7): the category trail with the
 * value, an automatic heading and opening line, then the category's listing with the
 * value applied. Admin texts of value pages come later, so the category's own text is not repeated here.
 */
export async function CategoryValuePage({
  locale,
  slug,
  value,
  searchParams,
  renderPurchaseAction,
}: CategoryValuePageProps) {
  const [{ category, landing }, tree] = await Promise.all([
    loadLandingOrRespond(locale, slug, value, searchParams),
    getCatalogTree(locale),
  ]);
  const dictionary = getCatalogDictionary(locale);
  const heading = landingHeading(categorySubject(category), landing);
  const path = localizedPath(locale, landingPath(category.slug, landing.value));
  const crumbs = [...categoryCrumbs(locale, category.breadcrumbs), { name: landing.name, path }];
  const count = pluralize(locale, landing.count, dictionary.models);

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        locale={locale}
        items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))}
      />
      <CategoryHeader
        locale={locale}
        heading={heading}
        productCount={landing.count}
        countOf="models"
        intro={dictionary.landingIntro(heading, count)}
        chips={categoryChips(category.children, category.id, tree)}
        activeId={category.id}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <ProductListing
          locale={locale}
          path={path}
          filterPath={localizedPath(locale, categoryPath(category.slug))}
          scope={{ categorySlug: category.slug }}
          searchParams={searchParams}
          renderPurchaseAction={renderPurchaseAction}
          landing={landing}
        />
      </Suspense>
      <JsonLd data={buildBreadcrumbListJsonLd(crumbs)} />
    </div>
  );
}
