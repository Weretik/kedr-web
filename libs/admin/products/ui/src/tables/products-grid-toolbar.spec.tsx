import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductsDataGrid } from './products-data-grid';

describe('ProductsGridToolbar category tree', () => {
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
