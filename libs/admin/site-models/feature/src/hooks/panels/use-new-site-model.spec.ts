import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNewSiteModel } from './use-new-site-model';

const api = vi.hoisted(() => ({ create: vi.fn(), showcase: vi.fn() }));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteCategoryOptionsQuery: () => ({
    data: [
      { id: 1, name: 'Фурнітура', parentId: null },
      { id: 3, name: 'Ручки', parentId: 1 },
    ],
    isLoading: false,
  }),
  useGetSiteShowcaseQuery: api.showcase,
  useCreateSiteModelMutation: () => [api.create, { isLoading: false }],
}));

const lone = (productId: number) => ({
  products: [
    {
      productId,
      name: `Ручка ${productId}`,
      slug: '',
      photo: '',
      categoryId: 3,
      categoryName: 'Ручки',
      retailPrice: null,
      inStock: true,
      model: null,
      values: [],
      problems: [],
    },
  ],
});

describe('useNewSiteModel', () => {
  beforeEach(() => {
    api.create.mockReset();
    api.showcase.mockReturnValue({
      data: { items: [lone(11), lone(12)] },
      isFetching: false,
      isError: false,
    });
  });

  it('offers final categories only and preselects the product it came with', () => {
    const { result } = renderHook(() =>
      useNewSiteModel({ productIds: [11], name: 'Ручка', categoryId: 1 }, vi.fn()),
    );
    expect(result.current.categories.map((category) => category.id)).toEqual([3]);
    expect(result.current.categoryId).toBeUndefined();
    expect(result.current.name).toBe('Ручка');
    expect(result.current.selected).toEqual([{ productId: 11, name: 'Ручка 11' }]);
  });

  it('creates the model with two products and opens it (SC-005)', async () => {
    api.create.mockReturnValue({ unwrap: () => Promise.resolve({ id: 42 }) });
    const onCreated = vi.fn();
    const { result } = renderHook(() => useNewSiteModel({}, onCreated));
    act(() => {
      result.current.onNameChange(' Ручка Рим ');
      result.current.onCategoryChange(3);
      result.current.onToggle({ productId: 11, name: 'Ручка 11' });
      result.current.onToggle({ productId: 12, name: 'Ручка 12' });
    });
    act(() => result.current.onSubmit());
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(42, 'Модель створено'));
    expect(api.create).toHaveBeenCalledWith({
      categoryId: 3,
      name: 'Ручка Рим',
      productIds: [11, 12],
    });
  });

  it('does not create without a name or a category, and shows a server error', async () => {
    const { result } = renderHook(() => useNewSiteModel({}, vi.fn()));
    act(() => result.current.onSubmit());
    expect(api.create).not.toHaveBeenCalled();
    api.create.mockReturnValue({ unwrap: () => Promise.reject({ status: 400 }) });
    act(() => {
      result.current.onNameChange('Рим');
      result.current.onCategoryChange(3);
    });
    act(() => result.current.onSubmit());
    await waitFor(() =>
      expect(result.current.error).toBe('Дані не підходять. Перевірте й спробуйте ще раз.'),
    );
  });

  it('drops a picked product on a second toggle', () => {
    const { result } = renderHook(() => useNewSiteModel({ productIds: [11] }, vi.fn()));
    act(() => result.current.onToggle({ productId: 11, name: 'Ручка 11' }));
    expect(result.current.selected).toEqual([]);
  });
});
