import { getCategory, getProductListPage } from '@site/catalog/data-access';
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
  withAttributeValue,
  withoutAttribute,
} from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import { notFound, permanentRedirect } from 'next/navigation';

import { CATEGORY_PLACEHOLDER_SLUG } from '../routing/category-routing';

import type {
  CategoryDetails,
  ListingLanding,
  ProductListPage,
  SearchParamsRecord,
} from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

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
 * The unfiltered list of a final category, for the redirect to a value page; null elsewhere. A failed load
 * throws on a value page (its own loader) and only skips the redirect here.
 */
export async function loadBaseListing(
  locale: Locale,
  category: CategoryDetails,
): Promise<ProductListPage | null> {
  if (category.children.length) return null;
  return getProductListPage(locale, { categorySlug: category.slug }, DEFAULT_LISTING_QUERY);
}

/** One value of color or size with its own page moves there: `?kolir=khrom` answers 308 to `/khrom`. */
export async function redirectToLanding(
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
 * `?page=N` past the last page answers 404 before anything streams, instead of an empty 200 page. On a value page
 * the value is part of the list, as in its listing.
 */
export async function respondPastLastPage(
  locale: Locale,
  category: CategoryDetails,
  searchParams: Promise<SearchParamsRecord>,
  landing?: ListingLanding,
) {
  const parsed = parseListingQuery(await searchParams);
  if (parsed.page <= 1) return;
  const query = landing
    ? withAttributeValue(
        withoutAttribute(parsed, landing.attribute),
        landing.attribute,
        landing.value,
      )
    : parsed;
  const page = await getProductListPage(locale, { categorySlug: category.slug }, query);
  if (page && !page.items.length) notFound();
}
