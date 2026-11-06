import { categoryPath } from '../paths/catalog-paths';

import type { ListingFilter, ListingFilterValue } from '../entities/listing-filter';
import type { ListingQuery } from '../listing/listing-query';

/**
 * Attributes whose single values get an indexable page of their own in a final category
 * (spec site/product/002 stage 7, owner 2026-11-06: color and size, never their combinations).
 */
export const LANDING_FILTER_CODES: readonly string[] = ['color', 'size'];

/** A value page is indexed and listed in the sitemap only with at least this many models. */
export const LANDING_MIN_MODELS = 2;

/** One attribute value of a final category shown as its own page (`/catalog/zavisy/khrom`). */
export type ListingLanding = {
  code: string;
  attribute: string;
  value: string;
  name: string;
  count: number;
};

export function landingPath(categorySlug: string, valueSlug: string): string {
  return `${categoryPath(categorySlug)}/${encodeURIComponent(valueSlug)}`;
}

const isLandingFilter = (filter: ListingFilter) => LANDING_FILTER_CODES.includes(filter.code);

const toLanding = (filter: ListingFilter, value: ListingFilterValue): ListingLanding => ({
  code: filter.code,
  attribute: filter.slug,
  value: value.slug,
  name: value.name,
  count: value.count,
});

/** The value page of `valueSlug` among the category's filters; color comes before size. */
export function findLanding(
  filters: readonly ListingFilter[],
  valueSlug: string,
): ListingLanding | null {
  for (const code of LANDING_FILTER_CODES) {
    const filter = filters.find((item) => item.code === code);
    const value = filter?.values.find((item) => item.slug === valueSlug);
    if (filter && value) return toLanding(filter, value);
  }
  return null;
}

/** Value pages worth a link and a sitemap entry: landing attributes, values with enough models. */
export function landingGroups(
  filters: readonly ListingFilter[],
): Array<{ filter: ListingFilter; landings: ListingLanding[] }> {
  return filters
    .filter(isLandingFilter)
    .map((filter) => ({
      filter,
      landings: filter.values
        .filter((value) => value.count >= LANDING_MIN_MODELS)
        .map((value) => toLanding(filter, value)),
    }))
    .filter((group) => group.landings.length > 0);
}

/** The one attribute value of a query that has no other filter, else null (its value page may replace it). */
export function singleAttributeChoice(
  query: ListingQuery,
): { attribute: string; value: string } | null {
  const entries = Object.entries(query.attributes);
  if (entries.length !== 1) return null;
  const [attribute, values] = entries[0]!;
  if (values.length !== 1) return null;
  if (query.inStock || query.isSale || query.isNew) return null;
  if (query.priceFrom !== null || query.priceTo !== null) return null;
  return { attribute, value: values[0]! };
}

/** The query with one attribute value added (a value page reads its own value from the path). */
export function withAttributeValue(
  query: ListingQuery,
  attribute: string,
  value: string,
): ListingQuery {
  const current = query.attributes[attribute] ?? [];
  if (current.includes(value)) return query;
  return { ...query, attributes: { ...query.attributes, [attribute]: [...current, value].sort() } };
}

/** The query without one attribute (links on a value page keep the value in the path, not the query). */
export function withoutAttribute(query: ListingQuery, attribute: string): ListingQuery {
  if (!(attribute in query.attributes)) return query;
  const attributes = { ...query.attributes };
  delete attributes[attribute];
  return { ...query, attributes };
}

/** The heading of a value page: «Завіси хром», «Завіси 100×75 мм»; a color reads in lower case after the subject. */
export function landingHeading(subject: string, landing: Pick<ListingLanding, 'code' | 'name'>) {
  const label = landing.code === 'color' ? landing.name.toLocaleLowerCase('uk') : landing.name;
  return `${subject} ${label}`;
}
