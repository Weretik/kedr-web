import type { AttributeChoices } from '../listing/attribute-choices';

/** How a filter shows its values: color circles, buttons (size, side), or checkboxes. */
export type FacetDisplay = 'swatch' | 'button' | 'checkbox';

export type FacetValue = {
  slug: string;
  name: string;
  hex: string | null;
  textureUrl: string | null;
  /** Cards the list shows with this value added to the other filters' choices. */
  count: number;
  selected: boolean;
};

export type Facet = {
  code: string;
  /** URL key of the filter, for example `kolir`. */
  slug: string;
  name: string;
  display: FacetDisplay;
  values: FacetValue[];
};

/** Attribute filters of a category with counts (spec catalog/006, phase 5). */
export type CategoryFacets = {
  totalCards: number;
  facets: Facet[];
};

/**
 * Keeps only choices the category offers, so a stray URL key (an ad tag) or a value of another category never
 * reaches the API.
 */
export function keepOfferedChoices(
  choices: AttributeChoices,
  facets: CategoryFacets,
): AttributeChoices {
  const result: Record<string, readonly string[]> = {};
  for (const facet of facets.facets) {
    const offered = new Set(facet.values.map((value) => value.slug));
    const kept = (choices[facet.slug] ?? []).filter((value) => offered.has(value));
    if (kept.length) result[facet.slug] = kept;
  }
  return result;
}
