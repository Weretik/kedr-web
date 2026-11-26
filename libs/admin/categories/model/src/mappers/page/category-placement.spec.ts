import { describe, expect, it } from 'vitest';

import {
  categoryNameError,
  categoryNeighbourPosition,
  categoryParentOptions,
} from './category-placement';

import type { AdminCategory } from '../../entities/admin-category';

const category = (id: number, parentId: number | null, sortOrder = 0) =>
  ({
    id,
    parentId,
    sortOrder,
    nameUk: `К${id}`,
    nameRu: `К${id}`,
    slug: `k${id}`,
  }) as AdminCategory;

const rows = [
  category(1, null, 0),
  category(2, 1, 2),
  category(3, 1, 1),
  category(4, 2),
  category(5, null, 1),
];

describe('category placement', () => {
  it('offers the top level and every category with its path, in tree order', () => {
    expect(categoryParentOptions(rows).map((option) => [option.id, option.path])).toEqual([
      [null, ''],
      [1, 'К1'],
      [3, 'К1 / К3'],
      [2, 'К1 / К2'],
      [4, 'К1 / К2 / К4'],
      [5, 'К5'],
    ]);
  });

  it('leaves out the moved category and its subcategories (SC-003)', () => {
    expect(categoryParentOptions(rows, 2).map((option) => option.id)).toEqual([null, 1, 3, 5]);
  });

  it('says whether a category can move up or down among its neighbours (SC-003)', () => {
    expect(categoryNeighbourPosition(rows, rows[2] as AdminCategory)).toMatchObject({
      canMoveUp: false,
      canMoveDown: true,
    });
    expect(categoryNeighbourPosition(rows, rows[1] as AdminCategory)).toMatchObject({
      canMoveUp: true,
      canMoveDown: false,
    });
    expect(categoryNeighbourPosition(rows, rows[3] as AdminCategory)).toMatchObject({
      canMoveUp: false,
      canMoveDown: false,
    });
    expect(categoryNeighbourPosition(rows, rows[1] as AdminCategory).position).toMatchObject({
      total: 2,
    });
  });

  it('asks for a name up to 100 characters (SC-001)', () => {
    expect(categoryNameError('  ')).toBe('Вкажіть назву.');
    expect(categoryNameError('х'.repeat(101))).toBe('Не довше 100 символів.');
    expect(categoryNameError(' Накладні ручки ')).toBeUndefined();
  });
});
