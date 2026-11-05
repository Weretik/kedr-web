import { mapSwatch } from './product-summary.mapper';

import type { components } from '@shared/api-contracts';
import type { CategoryFacets, FacetDisplay } from '@site/catalog/model';

type ApiFacets = components['schemas']['CategoryFacets'];

const DISPLAYS: readonly FacetDisplay[] = ['swatch', 'button', 'checkbox'];

export function mapCategoryFacets(facets: ApiFacets): CategoryFacets {
  return {
    totalCards: facets.totalCards,
    facets: facets.facets
      .map((facet) => ({
        code: facet.code,
        slug: facet.slug,
        name: facet.name,
        display: DISPLAYS.includes(facet.display) ? facet.display : 'checkbox',
        values: facet.values.map((value) => ({
          ...mapSwatch(value),
          count: value.count,
          selected: value.selected,
        })),
      }))
      .filter((facet) => facet.values.length > 0),
  };
}
