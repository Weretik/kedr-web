import { getCatalogTree } from '@site/catalog/data-access';
import { categoryPath } from '@site/catalog/model';
import { buildBreadcrumbListJsonLd } from '@site/catalog/seo';
import { Breadcrumbs, CategoryContent, CategoryHeader } from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';
import { Suspense } from 'react';

import { categoryChips } from './category-chips';
import { categoryCrumbs } from './category-crumbs';
import { loadBaseListing, loadCategoryOrRespond, redirectToLanding } from './category-loading';
import { ListingSkeleton } from '../listing/listing-skeleton';
import { ProductListing } from '../listing/product-listing';

import type { RenderListingPurchaseAction } from '../listing/listing-purchase';
import type { SearchParamsRecord } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type CategoryPageProps = {
  locale: Locale;
  slug: string;
  searchParams: Promise<SearchParamsRecord>;
  renderPurchaseAction?: RenderListingPurchaseAction;
};

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
