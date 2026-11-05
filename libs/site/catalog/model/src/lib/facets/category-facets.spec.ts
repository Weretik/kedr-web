import { keepOfferedChoices } from './category-facets';

import type { CategoryFacets } from './category-facets';

const value = (slug: string) => ({
  slug,
  name: slug,
  hex: null,
  textureUrl: null,
  count: 1,
  selected: false,
});

describe('category facets', () => {
  it('keeps only filters and values the category offers', () => {
    const facets: CategoryFacets = {
      totalCards: 2,
      facets: [
        {
          code: 'color',
          slug: 'kolir',
          name: 'Колір',
          display: 'swatch',
          values: [value('khrom')],
        },
      ],
    };
    expect(
      keepOfferedChoices({ kolir: ['khrom', 'zoloto'], gclid: ['abc'], storona: ['liva'] }, facets),
    ).toEqual({ kolir: ['khrom'] });
  });
});
