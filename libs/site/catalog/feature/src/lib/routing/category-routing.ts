import { getCatalogTree, getCategory, getProductListPage } from '@site/catalog/data-access';
import {
  CATALOG_PATH,
  DEFAULT_LISTING_QUERY,
  categoryPath,
  findLanding,
  landingGroups,
  landingPath,
  parseListingQuery,
  withAttributeValue,
  withoutAttribute,
} from '@site/catalog/model';
import { buildCategoryMetadata, buildLandingMetadata } from '@site/catalog/seo';
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

/** Value page metadata («Завіси хром»); moved, missing, and failed pages get none (the page answers). */
export async function generateLandingMetadata(
  locale: Locale,
  slug: string,
  value: string,
  searchParams: Promise<SearchParamsRecord>,
): Promise<Metadata> {
  if (slug === CATEGORY_PLACEHOLDER_SLUG) return {};
  const result = await getCategory(locale, slug);
  if (result.kind !== 'ok' || result.category.children.length) return {};
  const scope = { categorySlug: result.category.slug };
  const base = await getProductListPage(locale, scope, DEFAULT_LISTING_QUERY);
  const landing = base && findLanding(base.filters, value);
  if (!landing) return {};

  const query = withoutAttribute(parseListingQuery(await searchParams), landing.attribute);
  const page =
    query.page > 1
      ? await getProductListPage(
          locale,
          scope,
          withAttributeValue(query, landing.attribute, landing.value),
        )
      : null;
  const pastEnd = page !== null && page.items.length === 0;
  return buildLandingMetadata({ locale, category: result.category, query, landing, pastEnd });
}

const flatten = (nodes: readonly CatalogTreeNode[]): CatalogTreeNode[] =>
  nodes.flatMap((node) => [node, ...flatten(node.children)]);

/** Lists loaded at once for the sitemap, so a build or a crawl does not flood the API. */
const SITEMAP_LIST_CONCURRENCY = 4;

async function mapLimited<T, R>(items: readonly T[], limit: number, run: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await run(items[index]!);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

/** Value pages of a final category with enough models (color and size, stage 7). */
async function landingSitemapPaths(slug: string): Promise<string[]> {
  const page = await getProductListPage(
    DEFAULT_LOCALE,
    { categorySlug: slug },
    DEFAULT_LISTING_QUERY,
  );
  if (!page) throw new Error(`Catalog list of "${slug}" is unavailable for the sitemap`);
  return landingGroups(page.filters).flatMap(({ landings }) =>
    landings.map((landing) => landingPath(slug, landing.value)),
  );
}

/**
 * Hub, every category, and the value pages of final categories for the sitemap; slugs are the same in both
 * languages. An unavailable tree or list fails the sitemap (5xx, crawlers retry) instead of publishing a short one.
 */
export async function getCatalogSitemapPages(): Promise<SitemapPage[]> {
  const tree = await getCatalogTree(DEFAULT_LOCALE);
  if (!tree) throw new Error('Catalog tree is unavailable for the sitemap');
  const nodes = flatten(tree);
  const leaves = nodes.filter((node) => node.children.length === 0);
  const landings = await mapLimited(leaves, SITEMAP_LIST_CONCURRENCY, (node) =>
    landingSitemapPaths(node.slug),
  );
  return [
    { path: CATALOG_PATH },
    ...nodes.map((node) => ({ path: categoryPath(node.slug) })),
    ...landings.flat().map((path) => ({ path })),
  ];
}
