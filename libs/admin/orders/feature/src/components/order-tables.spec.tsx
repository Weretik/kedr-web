import { useGetWorkspaceDraftsQuery, useGetWorkspaceOrdersQuery } from '@admin/orders/data-access';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { OrderTables } from './order-tables';

const loadDraft = vi.hoisted(() => vi.fn());
const deleteDraft = vi.hoisted(() => vi.fn());
vi.mock('@admin/orders/data-access', () => ({
  useGetWorkspaceOrdersQuery: vi.fn(), useGetWorkspaceDraftsQuery: vi.fn(),
  useLazyGetWorkspaceDraftQuery: () => [loadDraft], useDeleteWorkspaceDraftMutation: () => [deleteDraft, { isLoading: false }],
}));
vi.mock('@admin/orders/ui', () => ({
  OrderListGrid: ({ onPage, onSort, onDelete, rows, rowCount, hideSearch, hideCustomerColumn, onDateChange }: { onPage: (page: number) => void; onSort: (sort: string) => void; onDelete?: (row: unknown) => void; rows: unknown[]; rowCount: number; hideSearch: boolean; hideCustomerColumn: boolean; onDateChange: (from: string, to: string) => void }) => <>
    <span>Server count: {rowCount}</span><button onClick={() => onPage(2)}>Друга сторінка</button><button onClick={() => onSort('orderNumber')}>Сортувати</button>
    <span>Hide search: {String(hideSearch)}</span><span>Hide customer: {String(hideCustomerColumn)}</span>
    <button onClick={() => onDateChange('2026-10-01', '2026-10-22')}>Задати дати</button>
    {rows.length > 0 && onDelete && <button onClick={() => onDelete(rows[0])}>Видалити рядок</button>}
  </>,
}));
const page = { data: { items: [], pageInfo: { pageNumber: 1, pageSize: 20, totalPages: 3, totalRecords: 55 } }, isLoading: false, isFetching: false, isError: false, refetch: vi.fn() };
describe('orders server tables and URL state', () => {
  beforeEach(() => {
    loadDraft.mockReset(); deleteDraft.mockReset();
    vi.mocked(useGetWorkspaceOrdersQuery).mockReturnValue(page as unknown as ReturnType<typeof useGetWorkspaceOrdersQuery>);
    vi.mocked(useGetWorkspaceDraftsQuery).mockReturnValue(page as unknown as ReturnType<typeof useGetWorkspaceDraftsQuery>);
  });
  it('filters before server paging by the current customer and ignores main orders URL keys', () => {
    render(<MemoryRouter initialEntries={['/customers/C1?customerOrdersOPage=3&customerOrdersOSort=-createdAt&customerOrdersOCustomer=C2&ordersTab=drafts']}>
      <Routes><Route path="customers/:id" element={<OrderTables counterpartyId="C1" prefix="customerOrders" returnTo="/customers/C1" panelOnly />} /></Routes>
    </MemoryRouter>);
    expect(useGetWorkspaceOrdersQuery).toHaveBeenLastCalledWith({ page: 3, pageSize: 20, searchTerm: undefined, counterpartyId: 'C1', createdFrom: undefined, createdTo: undefined, sort: '-createdAt' }, { skip: false });
    expect(screen.getByText('Hide search: true')).toBeTruthy();
    expect(screen.getByText('Hide customer: true')).toBeTruthy();
    expect(screen.getByText('Server count: 55')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Друга сторінка' }));
    expect(useGetWorkspaceOrdersQuery).toHaveBeenLastCalledWith({ page: 2, pageSize: 20, searchTerm: undefined, counterpartyId: 'C1', createdFrom: undefined, createdTo: undefined, sort: '-createdAt' }, { skip: false });
    fireEvent.click(screen.getByRole('button', { name: 'Задати дати' }));
    expect(useGetWorkspaceOrdersQuery).toHaveBeenLastCalledWith({ page: 1, pageSize: 20, searchTerm: undefined, counterpartyId: 'C1', createdFrom: '2026-10-01', createdTo: '2026-10-22', sort: '-createdAt' }, { skip: false });
  });
  it('switches to the independent drafts query and leaves the order page state intact', () => {
    render(<MemoryRouter initialEntries={['/orders?ordersOPage=4&ordersDPage=2']}>
      <Routes><Route path="orders" element={<OrderTables prefix="orders" />} /></Routes>
    </MemoryRouter>);
    fireEvent.click(screen.getByRole('tab', { name: 'Чернетки' }));
    expect(useGetWorkspaceDraftsQuery).toHaveBeenLastCalledWith({ page: 2, pageSize: 20, searchTerm: undefined, counterpartyId: undefined, createdFrom: undefined, createdTo: undefined, sort: '-updatedAt' }, { skip: false });
    fireEvent.click(screen.getByRole('tab', { name: 'Замовлення' }));
    expect(useGetWorkspaceOrdersQuery).toHaveBeenLastCalledWith({ page: 4, pageSize: 20, searchTerm: undefined, counterpartyId: undefined, createdFrom: undefined, createdTo: undefined, sort: '-createdAt' }, { skip: false });
  });
  it('loads a draft version before deletion and confirms the mutation', async () => {
    const draft = { draftId: 7, title: 'Чернетка', version: 'v1' };
    vi.mocked(useGetWorkspaceDraftsQuery).mockReturnValue({ ...page, data: { ...page.data, items: [draft] } } as unknown as ReturnType<typeof useGetWorkspaceDraftsQuery>);
    loadDraft.mockReturnValue({ unwrap: () => Promise.resolve(draft) });
    deleteDraft.mockReturnValue({ unwrap: () => Promise.resolve() });
    render(<MemoryRouter initialEntries={['/orders?ordersTab=drafts']}><Routes><Route path="orders" element={<OrderTables prefix="orders" />} /></Routes></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Видалити рядок' }));
    await waitFor(() => expect(screen.getByText('Ви впевнені, що хочете видалити «Чернетка»?')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Видалити', exact: true }));
    await waitFor(() => expect(deleteDraft).toHaveBeenCalledWith({ draftId: 7, version: 'v1' }));
  });
});
