import { catalogQueryReducer, initialCatalogQueryState } from './catalog-query-reducer';

import type { CatalogQueryState } from './catalog-query-reducer';

describe('catalogQueryReducer', () => {
  it('resets pagination atomically when filters or sort change', () => {
    const pageThree = {
      ...initialCatalogQueryState,
      query: { ...initialCatalogQueryState.query, page: 3 },
    };
    const draft = catalogQueryReducer(pageThree, {
      filters: { inStock: true },
      type: 'filtersChanged',
    });
    expect(catalogQueryReducer(draft, { type: 'filtersApplied' }).query.page).toBe(1);
    expect(
      catalogQueryReducer(pageThree, { sort: 'PriceDesc', type: 'sortChanged' }).query.page,
    ).toBe(1);
  });

  it('keeps search and category when global filter reset removes only filter fields', () => {
    const state: CatalogQueryState = {
      ...initialCatalogQueryState,
      query: {
        filters: { categoryId: 3, inStock: true, priceFrom: 10 },
        page: 4,
        search: 'кабель',
        sort: 'PriceDesc',
      },
    };

    expect(catalogQueryReducer(state, { type: 'queryReset' }).query).toEqual({
      filters: { categoryId: 3, categorySlug: undefined },
      page: 1,
      search: 'кабель',
      sort: 'PriceDesc',
    });
  });

  it('applies and dismisses search drafts independently', () => {
    const opened = catalogQueryReducer(initialCatalogQueryState, { type: 'searchOpened' });
    const changed = catalogQueryReducer(opened, {
      type: 'searchChanged',
      value: '  Кабель   мідний ',
    });

    expect(catalogQueryReducer(changed, { type: 'searchDismissed' })).toMatchObject({
      draftSearch: '',
      query: initialCatalogQueryState.query,
      searchVisible: false,
    });
    expect(catalogQueryReducer(changed, { type: 'searchApplied' })).toMatchObject({
      draftSearch: 'Кабель мідний',
      query: expect.objectContaining({ page: 1, search: 'Кабель мідний' }),
      searchVisible: false,
    });
  });

  it('applies a category draft and removes only the chosen query values', () => {
    const initial: CatalogQueryState = {
      ...initialCatalogQueryState,
      query: {
        filters: {
          categoryId: 1,
          categorySlug: 'electric',
          inStock: true,
          isNew: true,
          priceFrom: 10,
          priceTo: 100,
        },
        page: 3,
        search: 'кабель',
        sort: 'PriceDesc',
      },
    };
    const categoryDraft = catalogQueryReducer(
      catalogQueryReducer(initial, { type: 'categoryOpened' }),
      { categoryId: 2, type: 'categoryChanged' },
    );
    const categoryApplied = catalogQueryReducer(categoryDraft, { type: 'categoryApplied' });
    const filterRemoved = catalogQueryReducer(categoryApplied, {
      field: 'inStock',
      type: 'filterRemoved',
    });
    const priceRemoved = catalogQueryReducer(filterRemoved, { type: 'priceRangeRemoved' });
    const categoryRemoved = catalogQueryReducer(priceRemoved, { type: 'categoryRemoved' });
    const sortReset = catalogQueryReducer(categoryRemoved, { type: 'sortReset' });

    expect(categoryApplied.query.filters).toEqual(
      expect.objectContaining({ categoryId: 2, categorySlug: undefined, inStock: true }),
    );
    expect(filterRemoved.query.filters).toEqual(
      expect.objectContaining({ categoryId: 2, inStock: undefined, isNew: true }),
    );
    expect(priceRemoved.query.filters).toEqual(
      expect.objectContaining({ priceFrom: undefined, priceTo: undefined, isNew: true }),
    );
    expect(categoryRemoved.query.filters).toEqual(
      expect.objectContaining({ categoryId: undefined, categorySlug: undefined, isNew: true }),
    );
    expect(sortReset.query).toEqual(
      expect.objectContaining({ page: 1, search: 'кабель', sort: 'IdAsc' }),
    );
  });

  it('switches directly to a category selected from breadcrumbs', () => {
    const state = {
      ...initialCatalogQueryState,
      query: { ...initialCatalogQueryState.query, filters: { categoryId: 3 }, page: 4 },
    };

    expect(catalogQueryReducer(state, { categoryId: 2, type: 'categorySelected' }).query).toEqual(
      expect.objectContaining({ filters: { categoryId: 2, categorySlug: undefined }, page: 1 }),
    );
    expect(
      catalogQueryReducer(state, { categoryId: undefined, type: 'categorySelected' }).query,
    ).toEqual(
      expect.objectContaining({
        filters: { categoryId: undefined, categorySlug: undefined },
        page: 1,
      }),
    );
  });
});
