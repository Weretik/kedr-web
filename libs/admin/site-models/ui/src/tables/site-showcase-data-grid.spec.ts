import { describe, expect, it } from 'vitest';

import { showcaseGridRows } from './site-showcase-data-grid';

import type { SiteShowcaseItem, SiteShowcaseRow } from '@admin/site-models/model';

const item = (productId: number): SiteShowcaseItem => ({
  productId,
  name: `Завіса ${productId}`,
  slug: `zavisa-${productId}`,
  photo: '',
  categoryId: 11,
  categoryName: 'Завіси',
  retailPrice: 100,
  inStock: true,
  model: null,
  values: [],
  problems: [],
});

const row = (key: string, model: SiteShowcaseRow['model'], products: SiteShowcaseItem[]) =>
  ({
    key,
    model,
    name: key,
    photo: '',
    categoryId: 11,
    categoryName: 'Завіси',
    minPrice: 100,
    inStock: true,
    products,
    problems: [],
  }) satisfies SiteShowcaseRow;

describe('showcase grid rows', () => {
  const rows = [
    row('m1', { id: 1, name: 'Завіса', status: 'accepted' }, [item(1), item(2)]),
    row('p3', null, [item(3)]),
  ];

  it('shows only model rows until a model is expanded', () => {
    expect(showcaseGridRows(rows, new Set()).map((gridRow) => gridRow.id)).toEqual(['m1', 'p3']);
  });

  it('puts the products of an expanded model under it', () => {
    expect(showcaseGridRows(rows, new Set(['m1', 'p3'])).map((gridRow) => gridRow.id)).toEqual([
      'm1',
      'm1-1',
      'm1-2',
      'p3',
    ]);
  });
});
