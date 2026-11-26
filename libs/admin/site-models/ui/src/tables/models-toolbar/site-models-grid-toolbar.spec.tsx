import { DataGrid } from '@mui/x-data-grid';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelsGridToolbar } from './site-models-grid-toolbar';
import { SiteModelsToolbarContext } from './site-models-toolbar-context';

import type { SiteModelsToolbarValue } from './site-models-toolbar-context';

const value = (overrides: Partial<SiteModelsToolbarValue> = {}): SiteModelsToolbarValue => ({
  categories: [
    {
      id: 7,
      name: 'Ручки',
      parentId: null,
      onSiteProducts: 3,
      acceptedModels: 1,
      proposedModels: 0,
      problemCount: 0,
      loneProducts: 0,
      filterCount: 0,
    },
  ],
  categoriesLoading: false,
  categoryId: undefined,
  status: undefined,
  problem: undefined,
  onCategoryChange: vi.fn(),
  onStatusChange: vi.fn(),
  onProblemChange: vi.fn(),
  ...overrides,
});

const renderToolbar = (filters: SiteModelsToolbarValue) =>
  render(
    <SiteModelsToolbarContext.Provider value={filters}>
      <DataGrid columns={[]} rows={[]} showToolbar slots={{ toolbar: SiteModelsGridToolbar }} />
    </SiteModelsToolbarContext.Provider>,
  );

describe('SiteModelsGridToolbar', () => {
  it('has the search, the category tree and both filters (SC-003)', () => {
    const filters = value();
    renderToolbar(filters);
    expect(screen.getByPlaceholderText('Пошук моделей')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Усі категорії' }));
    fireEvent.click(screen.getByText('Ручки'));
    expect(filters.onCategoryChange).toHaveBeenCalledWith(7);
    expect(screen.getByRole('combobox', { name: 'Статус' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Чого бракує' })).toBeTruthy();
  });

  it('shows the picked category', () => {
    renderToolbar(value({ categoryId: 7 }));
    expect(screen.getByRole('button', { name: 'Ручки' })).toBeTruthy();
  });
});
