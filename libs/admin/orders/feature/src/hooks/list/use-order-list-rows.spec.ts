import { useGetWorkspaceDraftsQuery, useGetWorkspaceOrdersQuery } from '@admin/orders/data-access';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOrderListRows } from './use-order-list-rows';

import type { ListQuery } from '@admin/orders/model';

vi.mock('@admin/orders/data-access', () => ({
  useGetWorkspaceOrdersQuery: vi.fn(),
  useGetWorkspaceDraftsQuery: vi.fn(),
}));

const query = { page: 1, pageSize: 20 } as ListQuery;
const result = (id: string, total: number) => ({
  data: { items: [{ id }], pageInfo: { totalRecords: total } },
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: vi.fn(),
});

describe('useOrderListRows', () => {
  it('reads only the open tab and skips both lists for a wrong date range', () => {
    vi.mocked(useGetWorkspaceOrdersQuery).mockReturnValue(result('o1', 5) as never);
    vi.mocked(useGetWorkspaceDraftsQuery).mockReturnValue(result('d1', 2) as never);

    const drafts = renderHook(() => useOrderListRows(query, 'drafts', false)).result.current;
    expect(drafts.rows).toEqual([{ id: 'd1' }]);
    expect(drafts.total).toBe(2);
    expect(useGetWorkspaceOrdersQuery).toHaveBeenLastCalledWith(query, { skip: true });
    expect(useGetWorkspaceDraftsQuery).toHaveBeenLastCalledWith(query, { skip: false });

    renderHook(() => useOrderListRows(query, 'orders', true));
    expect(useGetWorkspaceOrdersQuery).toHaveBeenLastCalledWith(query, { skip: true });
    expect(useGetWorkspaceDraftsQuery).toHaveBeenLastCalledWith(query, { skip: true });
  });
});
