import { getCatalogTree, getCategory, getProductListPage } from '@site/catalog/data-access';
import { CATALOG_PATH, categoryPath, parseListingQuery } from '@site/catalog/model';
import { buildCategoryMetadata } from '@site/catalog/seo';
import { DEFAULT_LOCALE } from '@site/core/i18n';

import type { CatalogTreeNode, SearchParamsRecord } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { SitemapPage } from '@site/core/seo';
import type { Metadata } from 'next';

/**
 * Keeps the build from producing an empty param list. When the API is unreachable at build time this slug is
 * prerendered instead, and the page answers 404 for it without calling the API.
 */
export const CATEGORY_PLACEHOLDER_SLUG = '__placeholder__';

/** Top-level sections are prerendered at build; deeper categories render on their first request and are kept. */
export async function getCategoryStaticParams(locale: Locale): Promise<{ slug: string }[]> {
  const tree = await getCatalogTree(locale);
  return tree?.length
    ? tree.map((section) => ({ slug: section.slug }))
    : [{ slug: CATEGORY_PLACEHOLDER_SLUG }];
}

/** Category metadata for the requested page; moved, missing, and failed categories get none (the page answers). */
export async function generateCategoryMetadata(
  locale: Locale,
  slug: string,
  searchParams: Promise<SearchParamsRecord>,
): Promise<Metadata> {
  if (slug === CATEGORY_PLACEHOLDER_SLUG) return {};
  const result = await getCategory(locale, slug);
  if (result.kind !== 'ok') return {};

  const query = parseListingQuery(await searchParams);
  const page =
    query.page > 1
      ? await getProductListPage(locale, { categorySlug: result.category.slug }, query)
      : null;
  const pastEnd = page !== null && page.items.length === 0;
  return buildCategoryMetadata({ locale, category: result.category, query, pastEnd });
}

const flatten = (nodes: readonly CatalogTreeNode[]): CatalogTreeNode[] =>
  nodes.flatMap((node) => [node, ...flatten(node.children)]);

/**
 * Hub and every category for the sitemap; slugs are the same in both languages. An unavailable tree fails the
 * sitemap (5xx, crawlers retry) instead of publishing a list without categories.
 */
export async function getCatalogSitemapPages(): Promise<SitemapPage[]> {
  const tree = await getCatalogTree(DEFAULT_LOCALE);
  if (!tree) throw new Error('Catalog tree is unavailable for the sitemap');
  return [
    { path: CATALOG_PATH },
    ...flatten(tree).map((node) => ({ path: categoryPath(node.slug) })),
  ];
}
