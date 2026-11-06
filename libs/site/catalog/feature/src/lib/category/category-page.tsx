import { getCatalogTree, getCategory, getProductListPage } from '@site/catalog/data-access';
import {
  CATALOG_PATH,
  CATALOG_ROOTS,
  DEFAULT_LISTING_QUERY,
  LANDING_MIN_MODELS,
  categoryPath,
  findLanding,
  landingPath,
  listingHref,
  parseListingQuery,
  singleAttributeChoice,
  withoutAttribute,
} from '@site/catalog/model';
import { buildBreadcrumbListJsonLd } from '@site/catalog/seo';
import { Breadcrumbs, CategoryContent, CategoryHeader, LandingLinks } from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';
import { notFound, permanentRedirect } from 'next/navigation';
import { Suspense } from 'react';

import { categoryChips } from './category-chips';
import { categoryCrumbs } from './category-crumbs';
import { landingLinkGroups } from '../landing/landing-link-groups';
import { ListingSkeleton } from '../listing/listing-skeleton';
import { ProductListing } from '../listing/product-listing';
import { CATEGORY_PLACEHOLDER_SLUG } from '../routing/category-routing';

import type { RenderListingPurchaseAction } from '../listing/listing-purchase';
import type { CategoryDetails, ProductListPage, SearchParamsRecord } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type CategoryPageProps = {
  locale: Locale;
  slug: string;
  searchParams: Promise<SearchParamsRecord>;
  renderPurchaseAction?: RenderListingPurchaseAction;
};

function toQueryString(params: SearchParamsRecord): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value])
      query.append(key, item);
  }
  const text = query.toString();
  return text ? `?${text}` : '';
}

/**
 * Loads the category before anything streams, so a moved slug answers 308 and a missing one 404.
 * «Фурнітура» is the whole site, so its page moves to the catalog hub; Cosmos is never shown.
 * An unavailable API throws: the visitor gets the error page with status 500, never an empty 200 page.
 */
export async function loadCategoryOrRespond(
  locale: Locale,
  slug: string,
  searchParams?: Promise<SearchParamsRecord>,
  /** On a value page: the value, kept in the redirect of a moved category. */
  valueSlug?: string,
): Promise<CategoryDetails> {
  if (slug === CATEGORY_PLACEHOLDER_SLUG) notFound();
  const result = await getCategory(locale, slug);
  if (result.kind === 'ok') {
    if (result.category.id === CATALOG_ROOTS.hardwareId)
      permanentRedirect(localizedPath(locale, CATALOG_PATH));
    if (result.category.id === CATALOG_ROOTS.cosmosId) notFound();
    return result.category;
  }
  if (result.kind === 'moved') {
    // Keep ?page=2, filters, and sort so the redirect lands on the same listing.
    const query = searchParams ? toQueryString(await searchParams) : '';
    const path = valueSlug ? landingPath(result.slug, valueSlug) : categoryPath(result.slug);
    permanentRedirect(localizedPath(locale, path) + query);
  }
  if (result.kind === 'not-found') notFound();
  throw new Error(`Catalog API is unavailable for category "${slug}"`);
}

/**
 * The unfiltered list of a final category, for its value page links and redirects; null elsewhere. A failed load
 * throws on a value page (its own loader) and only drops the links here.
 */
export async function loadBaseListing(
  locale: Locale,
  category: CategoryDetails,
): Promise<ProductListPage | null> {
  if (category.children.length) return null;
  return getProductListPage(locale, { categorySlug: category.slug }, DEFAULT_LISTING_QUERY);
}

/** One value of color or size with its own page moves there: `?kolir=khrom` answers 308 to `/khrom`. */
async function redirectToLanding(
  locale: Locale,
  category: CategoryDetails,
  base: ProductListPage | null,
  searchParams: Promise<SearchParamsRecord>,
) {
  if (!base) return;
  const query = parseListingQuery(await searchParams);
  const choice = singleAttributeChoice(query);
  if (!choice) return;
  const landing = findLanding(base.filters, choice.value);
  if (!landing || landing.attribute !== choice.attribute || landing.count < LANDING_MIN_MODELS)
    return;
  const path = localizedPath(locale, landingPath(category.slug, landing.value));
  permanentRedirect(listingHref(path, withoutAttribute(query, landing.attribute)));
}

/**
 * Category page: breadcrumbs, the H1 with the count, category chips, then filters on the left and the streamed
 * products on the right, then admin text and FAQ. Main sections are in the header, so there is no tree panel.
 */
export async function CategoryPage({
  locale,
  slug,
  searchParams,
  renderPurchaseAction,
}: CategoryPageProps) {
  const [category, tree] = await Promise.all([
    loadCategoryOrRespond(locale, slug, searchParams),
    getCatalogTree(locale),
  ]);
  const base = await loadBaseListing(locale, category);
  await redirectToLanding(locale, category, base, searchParams);
  const crumbs = categoryCrumbs(locale, category.breadcrumbs);
  const path = localizedPath(locale, categoryPath(category.slug));

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        locale={locale}
        items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))}
      />
      <CategoryHeader
        locale={locale}
        heading={category.content?.h1 ?? category.name}
        productCount={category.productCount}
        chips={categoryChips(category.children, category.id, tree)}
        activeId={category.id}
      />
      <LandingLinks
        locale={locale}
        groups={landingLinkGroups(locale, category.slug, base?.filters ?? [])}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <ProductListing
          locale={locale}
          path={path}
          scope={{ categorySlug: category.slug }}
          searchParams={searchParams}
          renderPurchaseAction={renderPurchaseAction}
        />
      </Suspense>
      {category.content && <CategoryContent locale={locale} content={category.content} />}
      <JsonLd data={buildBreadcrumbListJsonLd(crumbs)} />
    </div>
  );
}
