import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelsDataGrid } from './site-models-data-grid';

import type { SiteModelsDataGridProps } from './site-models-data-grid';
import type { SiteModelListItem } from '@admin/site-models/model';

const item = (overrides: Partial<SiteModelListItem>): SiteModelListItem => ({
  id: 5,
  categoryId: 7,
  categoryName: 'Ручки',
  name: 'Ручка Рим',
  slug: 'ruchka-rym',
  status: 'accepted',
  productCount: 3,
  onSiteCount: 2,
  minPrice: 100,
  photo: '',
  axes: [],
  problems: [],
  oneCCategories: [],
  ...overrides,
});

const filters: SiteModelsDataGridProps['filters'] = {
  categories: [],
  categoriesLoading: false,
  categoryId: undefined,
  status: undefined,
  problem: undefined,
  onCategoryChange: vi.fn(),
  onStatusChange: vi.fn(),
  onProblemChange: vi.fn(),
};

const renderGrid = (props: Partial<SiteModelsDataGridProps> = {}) =>
  render(
    <SiteModelsDataGrid
      emptyMessage="Моделей ще немає"
      filters={filters}
      loading={false}
      onPageChange={vi.fn()}
      onPageSizeChange={vi.fn()}
      onRetry={vi.fn()}
      onSearchChange={vi.fn()}
      onView={vi.fn()}
      page={1}
      pageSize={20}
      rowCount={2}
      rows={[]}
      search=""
      {...props}
    />,
  );

describe('SiteModelsDataGrid', () => {
  it('maps a moved model, a proposal and a model without problems (SC-002)', () => {
    renderGrid({
      rows: [
        item({ id: 1, name: 'Ручка Рим', oneCCategories: ['Накладки'], axes: ['Колір'] }),
        item({ id: 2, name: 'Завіса', status: 'proposed', problems: ['model_no_seo'] }),
      ],
    });
    const rows = screen.getAllByRole('row').slice(1);
    expect(within(rows[0] as HTMLElement).queryByText(/У 1С/)).toBeNull();
    expect(within(rows[0] as HTMLElement).getByText('Колір')).toBeTruthy();
    expect(within(rows[0] as HTMLElement).queryByText(/Немає|бракує/)).toBeNull();
    expect(within(rows[1] as HTMLElement).getByText('Не перевірена')).toBeTruthy();
    expect(within(rows[1] as HTMLElement).getByText('Немає SEO-текстів')).toBeTruthy();
    expect(within(rows[1] as HTMLElement).getByText('—')).toBeTruthy();
  });

  it('shows the empty message', () => {
    renderGrid({ rowCount: 0 });
    expect(screen.getByText('Моделей ще немає')).toBeTruthy();
  });

  it('shows the error with «Повторити» (SC-012)', () => {
    const onRetry = vi.fn();
    renderGrid({ errorMessage: 'Не вдалося завантажити моделі.', onRetry, rows: [item({})] });
    expect(screen.getByRole('alert').textContent).toContain('Не вдалося завантажити моделі.');
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('sends the typed search (SC-003)', async () => {
    const onSearchChange = vi.fn();
    renderGrid({ onSearchChange });
    fireEvent.change(screen.getByPlaceholderText('Пошук моделей'), {
      target: { value: 'рим' },
    });
    await waitFor(() => expect(onSearchChange).toHaveBeenCalledWith('рим'));
  });
});
