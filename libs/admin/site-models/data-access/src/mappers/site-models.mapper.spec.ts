import { describe, expect, it } from 'vitest';

import {
  mapSiteCategoryRefs,
  mapSiteModel,
  mapSiteShowcase,
  toSetSiteModelTextBody,
  toSiteShowcaseParams,
} from './site-models.mapper';

describe('site models mapper', () => {
  it('maps a showcase row with its products and fills missing optional fields with null', () => {
    const page = mapSiteShowcase({
      items: [
        {
          key: 'p7',
          name: 'Ручка AB L',
          photo: '',
          categoryId: 10,
          categoryName: 'Ручки',
          inStock: true,
          products: [
            {
              productId: 7,
              name: 'Ручка AB L',
              slug: 'ruchka',
              photo: '',
              categoryId: 10,
              categoryName: 'Ручки',
              inStock: true,
              values: [{ attributeId: 1, attributeName: 'Колір', value: 'Латунь' }],
              problems: ['no_model'],
            },
          ],
          problems: ['no_model'],
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 50,
    });

    expect(page.items[0]).toMatchObject({ model: null, minPrice: null, problems: ['no_model'] });
    expect(page.items[0].products[0]).toMatchObject({ model: null, retailPrice: null });
  });

  it('maps a model card', () => {
    const model = mapSiteModel({
      id: 3,
      categoryId: 10,
      categoryName: 'Ручки',
      name: 'Ручка',
      slug: 'ruchka',
      status: 'accepted',
      axes: [{ attributeId: 1, code: 'side', name: 'Сторона', display: 'button', isSaved: true }],
      products: [
        {
          productId: 7,
          name: 'Ручка L',
          slug: 'ruchka-l',
          photo: '',
          inStock: true,
          exportToSite: true,
          isMain: true,
          values: [{ attributeId: 1, isManual: false }],
          problems: ['missing_axis_value'],
        },
      ],
      texts: [],
      characteristics: [],
      problems: [],
    });

    expect(model.mainProductId).toBeNull();
    expect(model.oneCCategories).toEqual([]);
    expect(model.products[0].values[0]).toEqual({
      attributeId: 1,
      valueId: null,
      name: null,
      isManual: false,
    });
  });

  it('keeps the 1C categories of a model card', () => {
    const model = mapSiteModel({
      id: 3,
      categoryId: 12,
      categoryName: 'Засувки',
      name: 'Завіса',
      slug: 'zavisa',
      status: 'accepted',
      axes: [],
      products: [],
      texts: [],
      characteristics: [],
      problems: [],
      oneCCategories: ['Завіси'],
    });

    expect(model.oneCCategories).toEqual(['Завіси']);
  });

  it('rejects an unknown status', () => {
    expect(() => mapSiteShowcase({ items: [{ status: 'x' }], totalCount: 1 })).toThrow();
  });

  it('leaves empty filters out of the query and trims texts', () => {
    expect(
      toSiteShowcaseParams({ search: '  ', page: 2, pageSize: 50, status: 'proposed' }),
    ).toEqual({
      categoryId: undefined,
      problem: undefined,
      search: undefined,
      page: 2,
      pageSize: 50,
      status: 'proposed',
    });
    expect(
      toSetSiteModelTextBody({
        shortDescription: ' a ',
        description: '',
        seoTitle: 'T',
        seoDescription: '',
      }),
    ).toEqual({ shortDescription: 'a', description: '', seoTitle: 'T', seoDescription: '' });
  });

  it('names a category as the site does: short name, else the 1C name; empty ones are kept', () => {
    expect(
      mapSiteCategoryRefs([
        { id: 5, name: 'KEDR Ручки на планцi', shortNameUk: 'На розетці (R-08/R-10)', parentId: 2 },
        { id: 6, name: 'KEDR Замки', shortNameUk: '  ', parentId: 2, productCount: 0 },
        { id: 2, name: 'Ручки', parentId: null },
      ]),
    ).toEqual([
      { id: 5, name: 'На розетці (R-08/R-10)', parentId: 2 },
      { id: 6, name: 'KEDR Замки', parentId: 2 },
      { id: 2, name: 'Ручки', parentId: null },
    ]);
  });
});
