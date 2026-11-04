import { getCatalogTree, getCategory } from '@site/catalog/data-access';
import { CATALOG_PATH, CATALOG_ROOTS, categoryPath } from '@site/catalog/model';
import { buildBreadcrumbListJsonLd } from '@site/catalog/seo';
import { Breadcrumbs, CategoryContent, CategoryHeader } from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';
import { notFound, permanentRedirect } from 'next/navigation';
import { Suspense } from 'react';

import { categoryChips } from './category-chips';
import { categoryCrumbs } from './category-crumbs';
import { ListingSkeleton } from '../listing/listing-skeleton';
import { ProductListing } from '../listing/product-listing';
import { CATEGORY_PLACEHOLDER_SLUG } from '../routing/category-routing';

import type { CategoryDetails, SearchParamsRecord } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type CategoryPageProps = {
  locale: Locale;
  slug: string;
  searchParams: Promise<SearchParamsRecord>;
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
    permanentRedirect(localizedPath(locale, categoryPath(result.slug)) + query);
  }
  if (result.kind === 'not-found') notFound();
  throw new Error(`Catalog API is unavailable for category "${slug}"`);
}

/**
 * Category page: breadcrumbs, the H1 with the count, category chips, then filters on the left and the streamed
 * products on the right, then admin text and FAQ. Main sections are in the header, so there is no tree panel.
 */
export async function CategoryPage({ locale, slug, searchParams }: CategoryPageProps) {
  const [category, tree] = await Promise.all([
    loadCategoryOrRespond(locale, slug, searchParams),
    getCatalogTree(locale),
  ]);
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
      <Suspense fallback={<ListingSkeleton />}>
        <ProductListing
          locale={locale}
          path={path}
          scope={{ categoryId: category.id }}
          searchParams={searchParams}
        />
      </Suspense>
      {category.content && <CategoryContent locale={locale} content={category.content} />}
      <JsonLd data={buildBreadcrumbListJsonLd(crumbs)} />
    </div>
  );
}
