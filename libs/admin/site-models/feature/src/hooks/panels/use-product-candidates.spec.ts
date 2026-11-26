import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { candidateSearchDelayMs, useProductCandidates } from './use-product-candidates';

const showcase = vi.hoisted(() => vi.fn());
vi.mock('@admin/site-models/data-access', () => ({ useGetSiteShowcaseQuery: showcase }));

const item = (
  productId: number,
  model: { id: number; name: string; status: 'accepted' } | null,
) => ({
  productId,
  name: `Товар ${productId}`,
  slug: '',
  photo: '',
  categoryId: 1,
  categoryName: 'Накладки',
  retailPrice: null,
  inStock: true,
  model,
  values: [],
  problems: [],
});

describe('useProductCandidates', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    showcase.mockReset();
    showcase.mockReturnValue({
      data: {
        items: [
          { products: [item(1, { id: 9, name: 'Рим', status: 'accepted' })] },
          { products: [item(2, null)] },
        ],
      },
      isFetching: false,
      isError: false,
    });
  });
  afterEach(() => vi.useRealTimers());

  it('asks for free products of the whole catalog first, free ones on top', () => {
    const excluded: number[] = [];
    const { result } = renderHook(() => useProductCandidates(excluded));
    expect(showcase).toHaveBeenLastCalledWith({ status: 'none', page: 1, pageSize: 50 });
    expect(result.current.candidates.map((candidate) => candidate.productId)).toEqual([2, 1]);
    expect(result.current.candidates[1]?.disabledReason).toBe('Уже в моделі «Рим»');
  });

  it('sends the search after a pause and all products on the switch', () => {
    const excluded: number[] = [];
    const { result } = renderHook(() => useProductCandidates(excluded));
    act(() => result.current.search.onSearchChange(' 123 '));
    expect(showcase).not.toHaveBeenLastCalledWith(expect.objectContaining({ search: '123' }));
    act(() => vi.advanceTimersByTime(candidateSearchDelayMs));
    expect(showcase).toHaveBeenLastCalledWith({
      status: 'none',
      search: '123',
      page: 1,
      pageSize: 50,
    });
    act(() => result.current.search.onScopeChange('all'));
    expect(showcase).toHaveBeenLastCalledWith({ search: '123', page: 1, pageSize: 50 });
  });
});
