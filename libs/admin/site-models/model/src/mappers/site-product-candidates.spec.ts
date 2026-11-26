import { describe, expect, it } from 'vitest';

import { siteProductCandidates } from './site-product-candidates';

import type { SiteShowcaseItem, SiteShowcaseRow } from '../entities/showcase/site-showcase';

const item = (
  productId: number,
  model: SiteShowcaseItem['model'],
  categoryName = 'Завіси',
): SiteShowcaseItem => ({
  productId,
  name: `Товар ${productId}`,
  slug: `p-${productId}`,
  photo: '',
  categoryId: 1,
  categoryName,
  retailPrice: null,
  inStock: true,
  model,
  values: [],
  problems: [],
});

const row = (products: SiteShowcaseItem[]): SiteShowcaseRow => ({
  key: `r${products[0]?.productId}`,
  model: products[0]?.model ?? null,
  name: 'r',
  photo: '',
  categoryId: 1,
  categoryName: 'Завіси',
  minPrice: null,
  inStock: true,
  products,
  problems: [],
});

describe('siteProductCandidates', () => {
  const accepted = { id: 9, name: 'Ручка Рим', status: 'accepted' as const };
  const proposed = { id: 8, name: 'Ручка Мілан', status: 'proposed' as const };

  it('puts free products first, then proposals, then products of accepted models, which are locked', () => {
    const result = siteProductCandidates(
      [row([item(1, accepted)]), row([item(2, proposed)]), row([item(3, null, 'Ручки')])],
      [],
    );
    expect(result.map((candidate) => candidate.productId)).toEqual([3, 2, 1]);
    expect(result[0]).toMatchObject({
      categoryName: 'Ручки',
      note: 'без моделі',
      disabledReason: null,
    });
    expect(result[1]).toMatchObject({
      note: 'зараз у пропозиції «Ручка Мілан»',
      disabledReason: null,
    });
    expect(result[2]).toMatchObject({ disabledReason: 'Уже в моделі «Ручка Рим»' });
  });

  it('leaves out products already in the model and repeats', () => {
    const result = siteProductCandidates(
      [row([item(1, null), item(2, null)]), row([item(1, null)])],
      [2],
    );
    expect(result.map((candidate) => candidate.productId)).toEqual([1]);
  });

  it('does not lock products of the model the panel adds to', () => {
    const result = siteProductCandidates([row([item(1, accepted)])], [], 9);
    expect(result[0]?.disabledReason).toBeNull();
  });
});
