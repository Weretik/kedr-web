import { describe, expect, it } from 'vitest';

import { isProductsRow, siteModelsGridRows } from './site-models-grid-rows';

import type { SiteModelListItem } from '../entities/models/site-model-list';

const model = (id: number) => ({ id, name: `Модель ${id}` }) as SiteModelListItem;

describe('site models grid rows', () => {
  it('puts the products row right under each opened model', () => {
    const rows = siteModelsGridRows([model(1), model(2), model(3)], new Set([2]));
    expect(rows.map((row) => row.id)).toEqual([1, 2, 'products-2', 3]);
    expect(rows.filter(isProductsRow)).toEqual([{ id: 'products-2', productsOf: 2 }]);
  });
});
