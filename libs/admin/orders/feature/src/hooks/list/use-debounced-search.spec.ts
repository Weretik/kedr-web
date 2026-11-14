import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedSearch } from './use-debounced-search';

describe('useDebouncedSearch', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('commits typed text after the pause, not before', () => {
    const commit = vi.fn();
    const { result } = renderHook(() => useDebouncedSearch('', 'orders', commit));
    act(() => result.current.setText('Дуб'));
    expect(result.current.text).toBe('Дуб');
    act(() => vi.advanceTimersByTime(299));
    expect(commit).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(commit).toHaveBeenCalledWith('Дуб');
  });

  it('takes the field text from the URL when the URL changes outside the field', () => {
    const commit = vi.fn();
    const { result, rerender } = renderHook(
      ({ term, mode }) => useDebouncedSearch(term, mode, commit),
      { initialProps: { term: 'Дуб', mode: 'orders' } },
    );
    rerender({ term: '', mode: 'drafts' });
    expect(result.current.text).toBe('');
    act(() => vi.advanceTimersByTime(500));
    expect(commit).not.toHaveBeenCalled();
  });
});
