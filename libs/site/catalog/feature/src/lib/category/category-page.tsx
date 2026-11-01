import { getCatalogTree, getCategory } from '@site/catalog/data-access';
import { categoryPath } from '@site/catalog/model';
import { buildBreadcrumbListJsonLd } from '@site/catalog/seo';
import { Breadcrumbs, CatalogTreePanel, CategoryContent, CategoryHeader } from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';
import { notFound, permanentRedirect } from 'next/navigation';
import { Suspense } from 'react';

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

/**
 * Loads the category before anything streams, so a moved slug answers 308 and a missing one 404.
 * An unavailable API throws: the visitor gets the error page with status 500, never an empty 200 page.
 */
export async function loadCategoryOrRespond(
  locale: Locale,
  slug: string,
): Promise<CategoryDetails> {
  if (slug === CATEGORY_PLACEHOLDER_SLUG) notFound();
  const result = await getCategory(locale, slug);
  if (result.kind === 'ok') return result.category;
  if (result.kind === 'moved') permanentRedirect(localizedPath(locale, categoryPath(result.slug)));
  if (result.kind === 'not-found') notFound();
  throw new Error(`Catalog API is unavailable for category "${slug}"`);
}

/** Category page: breadcrumbs, tree, header with subcategories, streamed listing, then admin text and FAQ. */
export async function CategoryPage({ locale, slug, searchParams }: CategoryPageProps) {
  const [category, tree] = await Promise.all([
    loadCategoryOrRespond(locale, slug),
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
      <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-8">
        {tree?.length ? (
          <CatalogTreePanel locale={locale} tree={tree} activeId={category.id} />
        ) : null}
        <div className="grid min-w-0 content-start gap-6">
          <CategoryHeader
            locale={locale}
            heading={category.content?.h1 ?? category.name}
            productCount={category.productCount}
            subcategories={category.children}
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
        </div>
      </div>
      <JsonLd data={buildBreadcrumbListJsonLd(crumbs)} />
    </div>
  );
}
