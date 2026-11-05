import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductsDataGrid } from './products-data-grid';

import type { AdminProductListItem } from '@admin/products/model';

const row: AdminProductListItem = {
  id: 7,
  nameUk: 'Ручка AL',
  nameRu: 'Ручка AL',
  productSlug: 'ruchka',
  photo: '',
  categoryId: null,
  categoryName: 'Ручки',
  inStock: true,
  isSale: false,
  isNew: false,
  exportToSite: true,
  price: 100,
  stock: 2,
  quantityInPack: 1,
  deletedAt: null,
  groupId: 4,
  groupName: 'Ручка Rio',
  problems: [
    { code: 'unresolved_material_code', text: '«AL»: не розшифровано' },
    { code: 'no_name', text: null },
  ],
};

function renderGrid(onProblemChange = vi.fn()) {
  render(
    <ProductsDataGrid
      booleanFilters={{}}
      filterModel={{ items: [] }}
      loading={false}
      onBooleanFilterChange={vi.fn()}
      onFilterChange={vi.fn()}
      onPageChange={vi.fn()}
      onPageSizeChange={vi.fn()}
      onRetry={vi.fn()}
      onSortChange={vi.fn()}
      onViewProduct={vi.fn()}
      page={0}
      pageSize={20}
      priceFilterable
      problemFilter={{
        problemsOnly: false,
        reason: undefined,
        reasons: [{ code: 'no_name', productCount: 36 }],
        onChange: onProblemChange,
      }}
      rowCount={1}
      rows={[row]}
      showGroup
      sort="id-asc"
    />,
  );
  return onProblemChange;
}

describe('ProductsDataGrid attribute problems', () => {
  it('shows the group and the first problem with the count of the others', () => {
    renderGrid();

    expect(screen.getByRole('columnheader', { name: 'Група' })).toBeTruthy();
    expect(screen.getByText('Ручка Rio')).toBeTruthy();
    expect(screen.getByText('Не розшифровано матеріал: AL +1')).toBeTruthy();
  });

  it('turns on «Тільки проблемні»', () => {
    const onChange = renderGrid();

    fireEvent.click(screen.getByLabelText('Тільки проблемні'));

    expect(onChange).toHaveBeenCalledWith(true, undefined);
  });
});
