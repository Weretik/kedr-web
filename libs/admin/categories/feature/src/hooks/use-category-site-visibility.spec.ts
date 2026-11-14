import { useSetCategorySiteVisibilityMutation } from '@admin/categories/data-access';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCategorySiteVisibility } from './use-category-site-visibility';

import type { AdminCategory } from '@admin/categories/model';

vi.mock('@admin/categories/data-access', () => ({
  useSetCategorySiteVisibilityMutation: vi.fn(),
}));

const shown = { id: 4, isShownOnSite: true } as AdminCategory;
const trigger = vi.fn();

describe('useCategorySiteVisibility', () => {
  beforeEach(() => {
    trigger.mockReset();
    vi.mocked(useSetCategorySiteVisibilityMutation).mockReturnValue([
      trigger,
      { isLoading: false },
    ] as never);
  });

  it('hides a shown category, closes the dialog, and reports it', async () => {
    trigger.mockReturnValue({ unwrap: () => Promise.resolve() });
    const onNotice = vi.fn();
    const { result } = renderHook(() => useCategorySiteVisibility(shown, onNotice));
    act(() => result.current.ask());
    expect(result.current.open).toBe(true);

    await act(() => result.current.confirm());

    expect(trigger).toHaveBeenCalledWith({ id: 4, isShownOnSite: false });
    expect(result.current.open).toBe(false);
    expect(onNotice).toHaveBeenCalledWith('Категорію сховано з сайту.');
  });

  it('keeps the dialog open with an error when the change fails', async () => {
    trigger.mockReturnValue({ unwrap: () => Promise.reject(new Error()) });
    const { result } = renderHook(() => useCategorySiteVisibility(shown, vi.fn()));
    act(() => result.current.ask());

    await act(() => result.current.confirm());

    expect(result.current.open).toBe(true);
    expect(result.current.error).toBe('Не вдалося змінити показ на сайті. Спробуйте ще раз.');
  });
});
