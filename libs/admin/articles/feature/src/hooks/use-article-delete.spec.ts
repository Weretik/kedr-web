import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useArticleDelete } from './use-article-delete';

const remove = vi.fn();
vi.mock('@admin/articles/data-access', () => ({
  useDeleteArticleMutation: () => [remove, { isLoading: false }],
}));

describe('useArticleDelete', () => {
  beforeEach(() => remove.mockReset().mockReturnValue({ unwrap: () => Promise.resolve() }));

  it('deletes the article and reports it was deleted', async () => {
    const onDeleted = vi.fn();
    const { result } = renderHook(() => useArticleDelete(7, onDeleted));
    act(() => result.current.ask());
    expect(result.current.open).toBe(true);

    await act(() => result.current.confirm());

    expect(remove).toHaveBeenCalledWith(7);
    expect(onDeleted).toHaveBeenCalled();
  });

  it('keeps the dialog with an error when deleting fails', async () => {
    remove.mockReturnValue({ unwrap: () => Promise.reject(new Error('boom')) });
    const onDeleted = vi.fn();
    const { result } = renderHook(() => useArticleDelete(7, onDeleted));
    act(() => result.current.ask());

    await act(() => result.current.confirm());

    expect(onDeleted).not.toHaveBeenCalled();
    expect(result.current.open).toBe(true);
    expect(result.current.error).toBeTruthy();
  });
});
