import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LoneProductsGrid } from './lone-products-grid';

import type { LoneProductsGridProps } from './lone-products-grid';
import type { SiteShowcaseItem } from '@admin/site-models/model';

const product: SiteShowcaseItem = {
  productId: 4021,
  name: 'Завіса 100×75 BK',
  slug: 'zavisa',
  photo: '',
  categoryId: 7,
  categoryName: 'Завіси',
  retailPrice: null,
  inStock: true,
  model: null,
  values: [],
  problems: ['no_model'],
};

function renderGrid(overrides: Partial<LoneProductsGridProps> = {}) {
  const props: LoneProductsGridProps = {
    rows: [product],
    rowCount: 1,
    page: 1,
    pageSize: 20,
    loading: false,
    error: false,
    onRetry: vi.fn(),
    onPageChange: vi.fn(),
    onNewModel: vi.fn(),
    renderAddToModel: (row) => <span>Вибір для {row.productId}</span>,
    ...overrides,
  };
  return { props, ...render(<LoneProductsGrid {...props} />) };
}

describe('LoneProductsGrid', () => {
  afterEach(cleanup);

  it('shows the product with its 1C code and category, the picker, and «Нова модель»', () => {
    const { props } = renderGrid();
    expect(screen.getByText('Завіса 100×75 BK')).toBeTruthy();
    expect(screen.getByText('Код 1С: 4021')).toBeTruthy();
    expect(screen.getByText('Завіси')).toBeTruthy();
    expect(screen.getByText('Вибір для 4021')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Нова модель' }));
    expect(props.onNewModel).toHaveBeenCalledWith(product);
  });

  it('says that every product is in a model when the table is empty', () => {
    renderGrid({ rows: [], rowCount: 0 });
    expect(screen.getByText('Усі товари в моделях')).toBeTruthy();
  });

  it('shows a load error with «Повторити»', () => {
    const { props } = renderGrid({ error: true });
    expect(screen.getByRole('alert').textContent).toContain('Не вдалося завантажити');
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(props.onRetry).toHaveBeenCalled();
  });
});
