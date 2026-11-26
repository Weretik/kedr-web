import { useDeleteCategoryMutation } from '@admin/categories/data-access';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCategoryDelete } from './use-category-delete';

import type { AdminCategory } from '@admin/categories/model';

vi.mock('@admin/categories/data-access', () => ({ useDeleteCategoryMutation: vi.fn() }));

const manual = { id: 800000001, parentId: 7, isManual: true } as AdminCategory;
const trigger = vi.fn();

describe('useCategoryDelete', () => {
  beforeEach(() => {
    trigger.mockReset();
    vi.mocked(useDeleteCategoryMutation).mockReturnValue([trigger, { isLoading: false }] as never);
  });

  it('deletes an empty manual category and goes to its parent (SC-002)', async () => {
    trigger.mockReturnValue({ unwrap: () => Promise.resolve() });
    const onDeleted = vi.fn();
    const { result } = renderHook(() => useCategoryDelete(manual, onDeleted));
    expect(result.current.canDelete).toBe(true);
    act(() => result.current.ask());

    await act(() => result.current.confirm());

    expect(trigger).toHaveBeenCalledWith(800000001);
    expect(onDeleted).toHaveBeenCalledWith(7);
    expect(result.current.open).toBe(false);
  });

  it('asks to clear models and subcategories first (SC-002)', async () => {
    trigger.mockReturnValue({ unwrap: () => Promise.reject({ status: 409 }) });
    const { result } = renderHook(() => useCategoryDelete(manual, vi.fn()));
    act(() => result.current.ask());

    await act(() => result.current.confirm());

    expect(result.current.open).toBe(true);
    expect(result.current.error).toBe('Спочатку приберіть моделі та підкатегорії.');
  });

  it('offers no delete for a 1C category', () => {
    const { result } = renderHook(() => useCategoryDelete({ ...manual, isManual: false }, vi.fn()));
    expect(result.current.canDelete).toBe(false);
  });
});
