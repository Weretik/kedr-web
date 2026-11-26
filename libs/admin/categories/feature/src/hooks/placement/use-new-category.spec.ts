import { useCreateCategoryMutation } from '@admin/categories/data-access';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNewCategory } from './use-new-category';

import type { AdminCategory } from '@admin/categories/model';

vi.mock('@admin/categories/data-access', () => ({ useCreateCategoryMutation: vi.fn() }));

const categories = [
  { id: 1, parentId: null, sortOrder: 0, nameUk: 'Ручки', isShownOnSite: false },
] as AdminCategory[];
const trigger = vi.fn();

describe('useNewCategory', () => {
  beforeEach(() => {
    trigger.mockReset();
    vi.mocked(useCreateCategoryMutation).mockReturnValue([trigger, { isLoading: false }] as never);
  });

  it('starts under the selected category with its site mark and creates with trimmed names (SC-001)', async () => {
    trigger.mockReturnValue({ unwrap: () => Promise.resolve({ id: 800000001 }) });
    const onCreated = vi.fn();
    const { result } = renderHook(() => useNewCategory(categories, onCreated));
    act(() => result.current.start(1));
    expect(result.current.draft).toEqual({
      nameUk: '',
      nameRu: '',
      parentId: 1,
      isShownOnSite: false,
    });

    await act(() => result.current.submit());
    expect(trigger).not.toHaveBeenCalled();
    expect(result.current.showErrors).toBe(true);

    act(() =>
      result.current.change({ ...result.current.draft, nameUk: ' Накладні ', nameRu: 'Накладные' }),
    );
    await act(() => result.current.submit());

    expect(trigger).toHaveBeenCalledWith({
      nameUk: 'Накладні',
      nameRu: 'Накладные',
      parentId: 1,
      isShownOnSite: false,
    });
    expect(onCreated).toHaveBeenCalledWith(800000001);
    expect(result.current.open).toBe(false);
  });

  it('keeps the panel open with the taken-name message (SC-001)', async () => {
    trigger.mockReturnValue({ unwrap: () => Promise.reject({ status: 409 }) });
    const { result } = renderHook(() => useNewCategory(categories, vi.fn()));
    act(() => result.current.start(null));
    act(() => result.current.change({ ...result.current.draft, nameUk: 'Ручки', nameRu: 'Ручки' }));

    await act(() => result.current.submit());

    expect(result.current.open).toBe(true);
    expect(result.current.error).toBe('Категорія з такою назвою вже є тут.');
  });
});
