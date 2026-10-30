import { describe, expect, it } from 'vitest';

import { fromProductsGridFilterModel, toProductsGridFilterModel } from './products-grid-filters';

describe('products server grid filters', () => {
  it('keeps search and price bounds without multi-column Data Grid filters', () => {
    const model = toProductsGridFilterModel(
      {
        page: 1,
        pageSize: 20,
        sort: 'id-asc',
        searchTerm: 'кабель',
        inStock: false,
        isSale: false,
        exportToSite: true,
        priceFrom: 10,
        priceTo: 50,
      },
      false,
    );
    expect(model.items).toHaveLength(1);
    expect(fromProductsGridFilterModel(model, false)).toMatchObject({
      searchTerm: 'кабель',
      priceFrom: 10,
      priceTo: undefined,
    });
  });

  it('does not send a price filter to the missing-photo query', () => {
    expect(
      fromProductsGridFilterModel(
        {
          items: [{ field: 'price', operator: '>=', value: '10' }],
          quickFilterValues: ['кабель'],
        },
        true,
      ),
    ).toMatchObject({ searchTerm: 'кабель', priceFrom: undefined, priceTo: undefined });
  });

  it('clears removed price filters before the next server request', () => {
    expect(fromProductsGridFilterModel({ items: [], quickFilterValues: [] }, false)).toMatchObject({
      priceFrom: undefined,
      priceTo: undefined,
    });
  });
});
