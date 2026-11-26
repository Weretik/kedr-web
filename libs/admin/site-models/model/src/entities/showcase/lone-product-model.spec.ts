import { describe, expect, it } from 'vitest';

import { similarModelForProduct } from './lone-product-model';

import type { LoneModelCandidate } from './lone-product-model';

const model = (
  id: number,
  name: string,
  categoryId = 7,
  status: LoneModelCandidate['status'] = 'accepted',
): LoneModelCandidate => ({ id, name, categoryId, status });

describe('similarModelForProduct', () => {
  const product = { name: 'Завіса 100×75 BK', categoryId: 7 };

  it('picks the model of the same category whose name shares the most leading words', () => {
    const models = [model(1, 'Завіса 120'), model(2, 'завіса 100×75'), model(3, 'Ручка 100×75')];
    expect(similarModelForProduct(product, models)?.id).toBe(2);
  });

  it('ignores models of another category and names with another first word', () => {
    const models = [model(1, 'Завіса 100×75', 8), model(2, 'Ручка Rio')];
    expect(similarModelForProduct(product, models)).toBeUndefined();
  });

  it('prefers an accepted model when two match equally', () => {
    const models = [model(1, 'Завіса 100×75', 7, 'proposed'), model(2, 'Завіса 100×75 CP')];
    expect(similarModelForProduct(product, models)?.id).toBe(2);
  });

  it('finds nothing for an empty name', () => {
    expect(
      similarModelForProduct({ name: '  ', categoryId: 7 }, [model(1, 'Завіса')]),
    ).toBeUndefined();
  });
});
