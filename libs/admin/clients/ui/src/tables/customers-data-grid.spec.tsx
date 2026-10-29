import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomersDataGrid } from './customers-data-grid';

import type { CustomerSort } from '@admin/clients/model';

function renderGrid(
  options: {
    error?: boolean;
    loading?: boolean;
    onPageChange?: (page: number) => void;
    onRetry?: () => void;
    onSearchChange?: (searchTerm: string | undefined) => void;
    onSortChange?: (sort: CustomerSort) => void;
    onView?: (id: string) => void;
    page?: number;
    rowCount?: number;
    searchTerm?: string;
    sort?: CustomerSort;
  } = {},
) {
  return render(
    <CustomersDataGrid
      error={options.error ?? false}
      loading={options.loading ?? false}
      onPageChange={options.onPageChange ?? vi.fn()}
      onPageSizeChange={vi.fn()}
      onRetry={options.onRetry ?? vi.fn()}
      onSearchChange={options.onSearchChange ?? vi.fn()}
      onSortChange={options.onSortChange ?? vi.fn()}
      onView={options.onView ?? vi.fn()}
      page={options.page ?? 1}
      pageSize={20}
      rowCount={options.rowCount ?? 1}
      rows={options.rowCount === 0 ? [] : [{ counterpartyId: '0002', name: 'Бета', phone: null }]}
      searchTerm={options.searchTerm}
      sort={options.sort ?? 'name'}
    />,
  );
}

describe('CustomersDataGrid', () => {
  afterEach(cleanup);

  it('uses one MUI table search and an icon action, without column filters', () => {
    const onView = vi.fn();
    renderGrid({ onView });

    const search = screen.getByPlaceholderText('Пошук клієнтів');
    const adornment = search
      .closest('.MuiInputBase-root')
      ?.querySelector('.MuiInputAdornment-positionStart');
    expect(adornment?.querySelector('[data-testid="SearchOutlinedIcon"]')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Знайти' })).toBeNull();
    expect(screen.queryByPlaceholderText('Фільтр')).toBeNull();
    expect(screen.getByRole('columnheader', { name: 'Дії' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути клієнта Бета' }));
    expect(onView).toHaveBeenCalledWith('0002');
  });

  it('sends quick search changes to the server query', async () => {
    const onSearchChange = vi.fn();
    renderGrid({ onSearchChange });
    fireEvent.change(screen.getByPlaceholderText('Пошук клієнтів'), { target: { value: 'Анна' } });
    await waitFor(() => expect(onSearchChange).toHaveBeenCalledWith('Анна'));
  });

  it('requests server sorting when a sortable column is selected', async () => {
    const onSortChange = vi.fn();
    renderGrid({ onSortChange });
    fireEvent.click(screen.getByRole('columnheader', { name: /^Телефон/ }));
    await waitFor(() => expect(onSortChange).toHaveBeenCalledWith('phone'));
  });

  it('requests descending server sorting on the second header selection', async () => {
    const onSortChange = vi.fn();
    renderGrid({ onSortChange, sort: 'phone' });
    fireEvent.click(screen.getByRole('columnheader', { name: /^Телефон/ }));
    await waitFor(() => expect(onSortChange).toHaveBeenCalledWith('-phone'));
  });

  it('keeps a deep-linked page while loading', () => {
    const onPageChange = vi.fn();
    renderGrid({ loading: true, page: 3, rowCount: 0, onPageChange });
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('opens the clicked customer row', () => {
    const onView = vi.fn();
    renderGrid({ onView });
    fireEvent.click(screen.getByRole('row', { name: /Бета/ }));
    expect(onView).toHaveBeenCalledWith('0002');
  });

  it('shows an empty state and a retry for failed requests', () => {
    const onRetry = vi.fn();
    const { rerender } = renderGrid({ rowCount: 0 });
    expect(screen.getByText('Клієнтів немає.')).toBeTruthy();
    rerender(
      <CustomersDataGrid
        error
        loading={false}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
        onRetry={onRetry}
        onSearchChange={vi.fn()}
        onSortChange={vi.fn()}
        onView={vi.fn()}
        page={1}
        pageSize={20}
        rowCount={0}
        rows={[]}
        sort="name"
      />,
    );
    expect(screen.getByText('Не вдалося завантажити клієнтів.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
