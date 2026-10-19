import { useGetCustomersPageQuery } from '@admin/clients/data-access';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CustomersPage } from './customers-page';

vi.mock('@admin/clients/data-access', () => ({ useGetCustomersPageQuery: vi.fn() }));
vi.mock('@admin/clients/ui', () => ({
  CustomersDataGrid: ({
    onSearchChange,
    onPageChange,
  }: {
    onSearchChange: (searchTerm: string | undefined) => void;
    onPageChange: (page: number) => void;
  }) => (
    <>
      <button onClick={() => onSearchChange('Анна')}>Шукати клієнта</button>
      <button onClick={() => onPageChange(2)}>Друга сторінка</button>
    </>
  ),
}));

describe('CustomersPage server query', () => {
  beforeEach(() => {
    vi.mocked(useGetCustomersPageQuery).mockReturnValue({
      currentData: { items: [], pageNumber: 3, pageSize: 20, totalPages: 5, totalRecords: 100 },
      isError: false,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetCustomersPageQuery>);
  });

  it('uses one server search across customers and resets pagination', () => {
    render(
      <MemoryRouter initialEntries={['/customers?page=3&pageSize=20']}>
        <Routes><Route path="customers" element={<CustomersPage />} /></Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText(/Знайдено 100 клієнтів/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Шукати клієнта' }));
    expect(useGetCustomersPageQuery).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 20,
      searchTerm: 'Анна',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Друга сторінка' }));
    expect(useGetCustomersPageQuery).toHaveBeenLastCalledWith({
      page: 2,
      pageSize: 20,
      searchTerm: 'Анна',
    });
  });

  it('ignores obsolete column filter and sort URL parameters', () => {
    render(
      <MemoryRouter initialEntries={['/customers?name=Бета&phone=050&sort=-phone&page=3']}>
        <Routes><Route path="customers" element={<CustomersPage />} /></Routes>
      </MemoryRouter>,
    );
    expect(useGetCustomersPageQuery).toHaveBeenLastCalledWith({ page: 3, pageSize: 20 });
  });
});
