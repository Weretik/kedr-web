import { act, renderHook } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSiteModelsList } from './use-site-models-list';

import type { ReactNode } from 'react';

const api = vi.hoisted(() => ({ list: vi.fn(), refetch: vi.fn() }));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelsQuery: api.list,
  useGetSiteModelCategoriesQuery: () => ({ data: [], isLoading: false }),
}));

const render = (entry: string) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[entry]}>{children}</MemoryRouter>
  );
  return renderHook(() => ({ list: useSiteModelsList(), search: useLocation().search }), {
    wrapper,
  });
};

describe('useSiteModelsList', () => {
  beforeEach(() => {
    api.list.mockReset();
    api.list.mockReturnValue({
      data: { items: [], totalCount: 0 },
      isFetching: false,
      isError: false,
      refetch: api.refetch,
    });
  });

  it('asks the server for the state in the address', () => {
    const { result } = render('/site-models?search=рим&status=proposed&page=2');
    expect(api.list).toHaveBeenLastCalledWith({
      search: 'рим',
      status: 'proposed',
      page: 2,
      pageSize: 20,
    });
    expect(result.current.list.emptyMessage).toBe('Нічого не знайдено');
  });

  it('sends a filter, resets the page and keeps it in the address (SC-003)', () => {
    const { result } = render('/site-models?page=3&panel=edit-1');
    expect(result.current.list.emptyMessage).toBe('Моделей ще немає');
    act(() => result.current.list.changeCategory(7));
    expect(result.current.search).toBe('?panel=edit-1&categoryId=7');
    act(() => result.current.list.changeProblem('model_no_seo'));
    act(() => result.current.list.changeSearch('рим'));
    expect(api.list).toHaveBeenLastCalledWith({
      categoryId: 7,
      problem: 'model_no_seo',
      search: 'рим',
      page: 1,
      pageSize: 20,
    });
    act(() => result.current.list.changePage(2));
    expect(result.current.list.state.page).toBe(2);
    act(() => result.current.list.changeSearch('рим'));
    expect(result.current.list.state.page).toBe(2);
  });

  it('refetches on retry', () => {
    const { result } = render('/site-models');
    result.current.list.retry();
    expect(api.refetch).toHaveBeenCalled();
  });
});
