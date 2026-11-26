import { describe, expect, it } from 'vitest';

import { categoryProblems } from './category-problems';

import type { AdminCategory } from '../../entities/admin-category';

const category = (overrides: Partial<AdminCategory> = {}): AdminCategory => ({
  deletedAt: null,
  id: 1,
  isDeleted: false,
  isShownOnSite: true,
  level: 0,
  nameRu: 'Замки',
  nameUk: 'Замки',
  parentId: null,
  slug: 'zamky',
  sortOrder: 0,
  sourceKey: '1',
  sourceName: 'Замки',
  productCount: 3,
  filledLanguages: ['ru', 'uk'],
  siteNameUk: null,
  siteNameRu: null,
  isClosedFromSearch: false,
  sharePicture: null,
  isManual: false,
  modelCount: 2,
  proposedModelCount: 0,
  ...overrides,
});

const labels = (row: AdminCategory, isFinal: boolean) =>
  categoryProblems(row, isFinal).map((problem) => problem.label);

describe('categoryProblems', () => {
  it('finds nothing for a complete category', () => {
    expect(categoryProblems(category(), true)).toEqual([]);
  });

  it('names the missing language or both', () => {
    expect(labels(category({ filledLanguages: [] }), true)).toEqual(['Немає тексту']);
    expect(labels(category({ filledLanguages: ['ru'] }), true)).toEqual(['Немає тексту UK']);
    expect(labels(category({ filledLanguages: ['uk'] }), true)).toEqual(['Немає тексту RU']);
  });

  it('checks models only for a final category', () => {
    const row = category({ modelCount: 0, proposedModelCount: 0 });
    expect(categoryProblems(row, true)).toEqual([
      { key: 'noModels', label: 'Немає моделей', tab: 'models' },
    ]);
    expect(categoryProblems(row, false)).toEqual([]);
    expect(labels(category({ proposedModelCount: 2 }), true)).toEqual(['Не перевірено моделей: 2']);
  });

  it('says nothing when the counts are unknown', () => {
    expect(
      categoryProblems(
        category({ filledLanguages: null, modelCount: null, proposedModelCount: null }),
        true,
      ),
    ).toEqual([]);
  });
});
