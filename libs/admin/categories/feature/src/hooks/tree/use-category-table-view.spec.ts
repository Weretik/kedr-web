import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useCategoryTableView } from './use-category-table-view';

import type { AdminCategory } from '@admin/categories/model';

const category = (id: number, parentId: number | null, extra: Partial<AdminCategory> = {}) =>
  ({
    id,
    parentId,
    nameUk: `Категорія ${id}`,
    nameRu: `Категория ${id}`,
    sourceName: `KEDR ${id}`,
    slug: `c-${id}`,
    sortOrder: id,
    isShownOnSite: true,
    isClosedFromSearch: false,
    isManual: false,
    filledLanguages: ['ru', 'uk'],
    siteNameUk: null,
    siteNameRu: null,
    ...extra,
  }) as AdminCategory;

const categories = [
  category(1, null),
  category(2, 1),
  category(3, 2, { isShownOnSite: false }),
  category(4, null),
];

const ids = (rows: { id: number }[]) => rows.map((row) => row.id);

describe('useCategoryTableView', () => {
  it('opens top-level parents first, then toggles one and all (SC-001)', () => {
    const { result } = renderHook(() => useCategoryTableView(categories));
    expect(ids(result.current.rows)).toEqual([1, 2, 4]);

    act(() => result.current.toggleOpen(2));
    expect(ids(result.current.rows)).toEqual([1, 2, 3, 4]);
    expect(result.current.allOpen).toBe(true);

    act(() => result.current.toggleAll());
    expect(ids(result.current.rows)).toEqual([1, 4]);
  });

  it('keeps found rows with their ancestors and counts the chips', () => {
    const { result } = renderHook(() => useCategoryTableView(categories));
    expect(result.current.counts.hidden).toBe(1);

    act(() => result.current.toggleFilter('hidden'));
    expect(ids(result.current.rows)).toEqual([1, 2, 3]);
    expect(result.current.filtering).toBe(true);

    act(() => {
      result.current.toggleFilter('hidden');
      result.current.setSearch('KEDR 4');
    });
    expect(ids(result.current.rows)).toEqual([4]);
  });
});
