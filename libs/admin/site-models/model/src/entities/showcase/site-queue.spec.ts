import { describe, expect, it } from 'vitest';

import {
  modelAddCandidates,
  siteQueueSelection,
  nextSiteQueueKey,
  similarSiteModels,
  siteQueueCounts,
  siteQueueFilter,
} from './site-queue';

import type { SiteModelCategory, SiteShowcaseRow } from './site-showcase';

const category = (
  id: number,
  parentId: number | null,
  counts: Partial<SiteModelCategory> = {},
): SiteModelCategory => ({
  id,
  name: `Категорія ${id}`,
  parentId,
  onSiteProducts: 0,
  acceptedModels: 0,
  proposedModels: 0,
  problemCount: 0,
  loneProducts: 0,
  filterCount: 0,
  ...counts,
});

const row = (id: number, name: string, status: 'proposed' | 'accepted', categoryId = 7) =>
  ({
    key: `m${id}`,
    model: { id, name, status },
    name,
    photo: '',
    categoryId,
    categoryName: '',
    minPrice: null,
    inStock: true,
    products: [],
    problems: [],
  }) satisfies SiteShowcaseRow;

describe('site queue', () => {
  it('maps each view to the showcase filters', () => {
    expect(siteQueueFilter('review')).toEqual({ status: 'proposed' });
    expect(siteQueueFilter('problems')).toEqual({ status: 'accepted', problem: 'any' });
    expect(siteQueueFilter('lone')).toEqual({ status: 'none' });
    expect(siteQueueFilter('all')).toEqual({});
  });

  it('counts the top categories for the whole site and one category when selected', () => {
    const categories = [
      category(1, null, { acceptedModels: 3, proposedModels: 5, problemCount: 2, loneProducts: 1 }),
      category(2, 1, { acceptedModels: 1, proposedModels: 2, problemCount: 1 }),
      category(3, null, { proposedModels: 1 }),
    ];
    expect(siteQueueCounts(categories, undefined)).toEqual({
      review: 6,
      problems: 2,
      lone: 1,
      all: 10,
    });
    expect(siteQueueCounts(categories, 2)).toEqual({ review: 2, problems: 1, lone: 0, all: 3 });
  });

  it('moves to the next key, or to the previous one after the last', () => {
    expect(nextSiteQueueKey(['a', 'b', 'c'], 'a')).toBe('b');
    expect(nextSiteQueueKey(['a', 'b', 'c'], 'c')).toBe('b');
    expect(nextSiteQueueKey(['a', 'b'], 'x')).toBe('a');
    expect(nextSiteQueueKey([], undefined)).toBeUndefined();
  });

  it('finds other proposed models of the category that start with the same word', () => {
    const rows = [
      row(1, 'Завіса 100×75', 'proposed'),
      row(2, 'завіса 100×75 BK', 'proposed'),
      row(3, 'Завіса 120×80', 'accepted'),
      row(4, 'Завіса 100', 'proposed', 8),
      row(5, 'Ручка RIO', 'proposed'),
    ];
    expect(
      similarSiteModels(rows, { id: 1, name: 'Завіса 100×75', categoryId: 7 }).map(
        (item) => item.model?.id,
      ),
    ).toEqual([2]);
  });
});

describe('modelAddCandidates', () => {
  const item = (productId: number) => ({ productId }) as SiteShowcaseRow['products'][number];
  const lone = (productId: number) =>
    ({
      ...row(0, 'Ручка', 'proposed'),
      key: `p${productId}`,
      model: null,
      products: [item(productId)],
    }) satisfies SiteShowcaseRow;

  it('offers lone and proposed-model products that are not in the model yet', () => {
    const rows = [
      lone(1),
      { ...row(2, 'Ручка А', 'proposed'), products: [item(2), item(3)] },
      { ...row(4, 'Ручка Б', 'accepted'), products: [item(4)] },
    ];
    expect(modelAddCandidates(rows, [3]).map((candidate) => candidate.productId)).toEqual([1, 2]);
  });
});

describe('siteQueueSelection', () => {
  const lone = { ...row(0, 'Ручка', 'proposed'), key: 'p5', model: null } satisfies SiteShowcaseRow;
  const rows = [row(1, 'Завіса', 'proposed'), lone, row(2, 'Ручка А', 'accepted')];

  it('opens the first row when nothing is chosen and offers the next one', () => {
    expect(siteQueueSelection(rows, undefined)).toEqual({
      selectedKey: 'm1',
      nextKey: 'p5',
      modelId: 1,
      lone: undefined,
    });
  });

  it('opens a lone product row and goes back one row after the last', () => {
    expect(siteQueueSelection(rows, 'p5')).toMatchObject({ modelId: undefined, lone });
    expect(siteQueueSelection(rows, 'm2').nextKey).toBe('p5');
    expect(siteQueueSelection([rows[0]], 'm1').nextKey).toBeUndefined();
  });
});
