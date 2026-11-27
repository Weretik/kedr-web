import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSiteModelEditPanel } from './use-site-model-edit-panel';

const api = vi.hoisted(() => ({
  change: vi.fn(),
  idle: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelQuery: () => ({ data: undefined, isLoading: true, isError: false }),
  useGetSiteCategoryOptionsQuery: () => ({
    data: [
      { id: 1, name: 'Фурнітура', parentId: null },
      { id: 3, name: 'Ручки', parentId: 1 },
    ],
    isLoading: false,
  }),
  useGetAttributeOptionsQuery: () => ({ data: [{ id: 2, name: 'Колір', kind: 'list' }] }),
  useChangeSiteModelCategoryMutation: () => [api.change, { isLoading: false }],
  useAcceptSiteModelsMutation: api.idle,
  useRenameSiteModelMutation: api.idle,
  useSetSiteModelAxesMutation: api.idle,
  useAddSiteModelProductsMutation: api.idle,
  useRemoveSiteModelProductMutation: api.idle,
  useFillSiteModelFromNamesMutation: api.idle,
  useSetSiteModelTextMutation: api.idle,
  useSetProductAttributeMutation: api.idle,
  useCreateAttributeOptionMutation: api.idle,
  useCreateAttributeValueOptionMutation: api.idle,
}));

describe('useSiteModelEditPanel', () => {
  beforeEach(() => api.change.mockReset());

  it('offers final categories and saves another one (SC-004)', async () => {
    api.change.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    const onNotice = vi.fn();
    const { result } = renderHook(() => useSiteModelEditPanel(5, onNotice));
    expect(result.current.categories.map((category) => category.id)).toEqual([3]);
    expect(result.current.attributeOptions).toHaveLength(1);
    act(() => result.current.saveCategory(3));
    await waitFor(() => expect(onNotice).toHaveBeenCalledWith('Категорію змінено'));
    expect(api.change).toHaveBeenCalledWith({ id: 5, categoryId: 3 });
  });

  it('shows the server error of the category block', async () => {
    api.change.mockReturnValue({
      unwrap: () =>
        Promise.reject({ status: 400, fieldErrors: { categoryId: ['Must be a final category.'] } }),
    });
    const { result } = renderHook(() => useSiteModelEditPanel(5, vi.fn()));
    act(() => result.current.saveCategory(1));
    await waitFor(() =>
      expect(result.current.categoryError).toBe(
        'Модель створюється лише в кінцевій категорії (без підкатегорій).',
      ),
    );
  });
});
