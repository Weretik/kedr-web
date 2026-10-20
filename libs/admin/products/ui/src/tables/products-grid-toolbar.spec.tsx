import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductsDataGrid } from './products-data-grid';

describe('ProductsGridToolbar category tree', () => {
  it('expands and collapses branches without selecting them, then selects a parent by its text', async () => {
    const onCategoryChange = vi.fn();
    render(<ProductsDataGrid
      booleanFilters={{}}
      categories={[
        { id: 5513, parentId: null, nameUk: 'Фурнітура', pathUk: 'Фурнітура', depth: 0, hasChildren: true },
        { id: 900001, parentId: 5513, nameUk: 'Завіси', pathUk: 'Фурнітура Завіси', depth: 1, hasChildren: true },
        { id: 1707, parentId: 900001, nameUk: 'Накладні (метелик)', pathUk: 'Фурнітура Завіси Накладні (метелик)', depth: 2, hasChildren: false },
      ]}
      filterModel={{ items: [] }}
      loading={false}
      onBooleanFilterChange={() => undefined}
      onCategoryChange={onCategoryChange}
      onFilterChange={() => undefined}
      onPageChange={() => undefined}
      onPageSizeChange={() => undefined}
      onRetry={() => undefined}
      onSortChange={() => undefined}
      onViewProduct={() => undefined}
      page={0}
      pageSize={20}
      priceFilterable
      rowCount={0}
      rows={[]}
      sort="id-asc"
    />);

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Категорія' }));
    expect(await screen.findByRole('option', { name: 'Рівень 1: Фурнітура' })).toBeTruthy();
    expect(screen.queryByRole('option', { name: 'Рівень 2: Завіси' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути категорію Фурнітура' }));
    expect(screen.getByRole('option', { name: 'Рівень 2: Завіси' })).toBeTruthy();
    expect(onCategoryChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути категорію Завіси' }));
    expect(screen.getByRole('option', { name: 'Рівень 3: Накладні (метелик)' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Згорнути категорію Фурнітура' }));
    expect(screen.queryByRole('option', { name: 'Рівень 2: Завіси' })).toBeNull();
    expect(screen.queryByRole('option', { name: 'Рівень 3: Накладні (метелик)' })).toBeNull();
    expect(onCategoryChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('option', { name: 'Рівень 1: Фурнітура' }));
    expect(onCategoryChange).toHaveBeenCalledWith(5513);
  }, 10000);

  it('shows nested Ukrainian names without IDs and selects a leaf', async () => {
    const onCategoryChange = vi.fn();
    render(<ProductsDataGrid
      booleanFilters={{}}
      categories={[
        { id: 5513, parentId: null, nameUk: 'Фурнітура', pathUk: 'Фурнітура', depth: 0, hasChildren: true },
        { id: 900001, parentId: 5513, nameUk: 'Завіси', pathUk: 'Фурнітура Завіси', depth: 1, hasChildren: true },
        { id: 1707, parentId: 900001, nameUk: 'Накладні (метелик)', pathUk: 'Фурнітура Завіси Накладні (метелик)', depth: 2, hasChildren: false },
      ]}
      filterModel={{ items: [] }}
      loading={false}
      onBooleanFilterChange={() => undefined}
      onCategoryChange={onCategoryChange}
      onFilterChange={() => undefined}
      onPageChange={() => undefined}
      onPageSizeChange={() => undefined}
      onRetry={() => undefined}
      onSortChange={() => undefined}
      onViewProduct={() => undefined}
      page={0}
      pageSize={20}
      priceFilterable
      rowCount={0}
      rows={[]}
      sort="id-asc"
    />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Категорія' }), { target: { value: 'Накладні' } });
    expect(await screen.findByRole('option', { name: 'Рівень 1: Фурнітура' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Рівень 2: Завіси' })).toBeTruthy();
    const option = await screen.findByRole('option', { name: 'Рівень 3: Накладні (метелик)' });
    expect(option.textContent).toBe('Накладні (метелик)');
    fireEvent.click(option);
    expect(onCategoryChange).toHaveBeenCalledWith(1707);
  });
});
