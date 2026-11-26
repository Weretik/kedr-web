import { describe, expect, it } from 'vitest';

import { mapSiteModelList, toSiteModelListParams } from './site-model-list.mapper';

describe('site model list mapper', () => {
  it('maps a list row with its 1C categories and fills a missing price with null', () => {
    const page = mapSiteModelList({
      items: [
        {
          id: 3,
          categoryId: 11,
          categoryName: 'Ручки на розетці',
          name: 'Ручка Toledo',
          slug: 'ruchka-toledo',
          status: 'accepted',
          productCount: 3,
          onSiteCount: 2,
          photo: '',
          axes: ['Колір'],
          problems: ['model_no_seo'],
          oneCCategories: ['Ручки дверні'],
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 50,
    });

    expect(page.items[0]).toMatchObject({
      id: 3,
      minPrice: null,
      oneCCategories: ['Ручки дверні'],
      problems: ['model_no_seo'],
    });
  });

  it('treats a row without 1C categories as an empty list', () => {
    const page = mapSiteModelList({
      items: [
        {
          id: 3,
          categoryId: 11,
          categoryName: 'Ручки',
          name: 'Ручка',
          slug: 'ruchka',
          status: 'proposed',
          productCount: 1,
          onSiteCount: 1,
          photo: '',
          axes: [],
          problems: [],
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 50,
    });

    expect(page.items[0].oneCCategories).toEqual([]);
  });

  it('leaves empty filters out of the query', () => {
    expect(toSiteModelListParams({ search: '  ', page: 2, pageSize: 50 })).toEqual({
      categoryId: undefined,
      status: undefined,
      problem: undefined,
      search: undefined,
      page: 2,
      pageSize: 50,
    });
  });
});
