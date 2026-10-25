import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { OrderListGrid } from './order-list-grid';

import type { OrderSummary } from '@admin/orders/model';

const order = (orderId: number, syncStatus: string): OrderSummary =>
  ({
    orderId,
    orderNumber: `KD-${orderId}`,
    counterpartyId: 'C-1',
    counterpartyName: 'ТОВ Кедр',
    createdAtUtc: '2026-10-20T10:00:00Z',
    lineCount: 1,
    totalAmount: 100,
    syncStatus,
  }) satisfies OrderSummary;

function renderGrid(overrides: Partial<Parameters<typeof OrderListGrid>[0]> = {}) {
  render(
    <OrderListGrid
      createdFrom=""
      createdTo=""
      error={false}
      hideCustomerColumn={false}
      hideSearch
      loading={false}
      mode="orders"
      onDateChange={vi.fn()}
      onPage={vi.fn()}
      onPageSize={vi.fn()}
      onRetry={vi.fn()}
      onSearch={vi.fn()}
      onSort={vi.fn()}
      onView={vi.fn()}
      page={1}
      pageSize={20}
      rowCount={3}
      rows={[order(1, 'Accepted'), order(2, 'TransportError'), order(3, 'Unknown')]}
      search=""
      sort="-createdAt"
      {...overrides}
    />,
  );
}

describe('OrderListGrid', () => {
  it('shows 1C sync status as a Ukrainian label without leaking unknown codes', () => {
    renderGrid();

    expect(screen.getByText('Прийнято в 1С')).toBeTruthy();
    expect(screen.getByText('Помилка зв’язку з 1С')).toBeTruthy();
    expect(screen.getByText('Невідомий стан')).toBeTruthy();
    expect(screen.queryByText('Unknown')).toBeNull();
  });

  it('shows a load error inside the table with a retry action', () => {
    const onRetry = vi.fn();
    renderGrid({ error: true, onRetry, rowCount: 0 });

    expect(screen.getByRole('alert').textContent).toContain('Не вдалося завантажити записи.');
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
