import { useAddCategorySiteModelsMutation } from '@admin/categories/data-access';
import { useGetSiteModelsQuery } from '@admin/site-models/data-access';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCategorySiteModels } from './use-category-site-models';

import type { AdminCategory } from '@admin/categories/model';

vi.mock('@admin/categories/data-access', () => ({ useAddCategorySiteModelsMutation: vi.fn() }));
vi.mock('@admin/site-models/data-access', () => ({ useGetSiteModelsQuery: vi.fn() }));

const category = { id: 11, nameUk: 'Накладні' } as AdminCategory;
const row = (id: number, categoryId: number, status = 'accepted') => ({
  id,
  categoryId,
  categoryName: 'Ручки',
  name: `Модель ${id}`,
  status,
  productCount: 2,
});
const trigger = vi.fn();

describe('useCategorySiteModels', () => {
  beforeEach(() => {
    trigger.mockReset();
    vi.mocked(useAddCategorySiteModelsMutation).mockReturnValue([
      trigger,
      { isLoading: false },
    ] as never);
    vi.mocked(useGetSiteModelsQuery).mockReturnValue({
      data: { items: [row(1, 11, 'proposed'), row(2, 11), row(3, 12)] },
      isLoading: false,
      isError: false,
      isFetching: false,
    } as never);
  });

  it('lists the models of this category and adds two picked ones (SC-004)', async () => {
    trigger.mockReturnValue({ unwrap: () => Promise.resolve() });
    const onNotice = vi.fn();
    const { result } = renderHook(() => useCategorySiteModels(category, onNotice));
    expect(result.current.models.map((model) => [model.id, model.isProposed])).toEqual([
      [1, true],
      [2, false],
    ]);

    act(() => result.current.start());
    act(() => result.current.toggle(3));
    act(() => result.current.toggle(4));
    expect(result.current.panel.presentIds.has(1)).toBe(true);
    await act(() => result.current.submit());

    expect(trigger).toHaveBeenCalledWith({ id: 11, modelIds: [3, 4] });
    expect(onNotice).toHaveBeenCalledWith('Моделі додано.');
    expect(result.current.panel.open).toBe(false);
  });
});
