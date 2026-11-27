import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SiteOrdersDataGrid } from './site-orders-data-grid';
import { siteOrdersGridColumns } from './site-orders-grid.columns';

import type { SiteOrdersDataGridProps } from './site-orders-data-grid';
import type { SiteOrderListItem } from '@admin/site-orders/model';

const row = (overrides: Partial<SiteOrderListItem>): SiteOrderListItem => ({
  orderId: '3f2b8c1e-7a4d-4e1b-9c2a-1d2e3f4a5b6c',
  placedAtUtc: '2026-11-24T07:45:00Z',
  firstName: 'Ірина',
  phone: '+380671234567',
  lineCount: 30,
  total: 7209,
  telegramStatus: 'sent',
  telegramLastError: null,
  oneCOrderId: null,
  oneCOrderNumber: null,
  oneCDocumentNumber: null,
  ...overrides,
});

function renderGrid(overrides: Partial<SiteOrdersDataGridProps> = {}) {
  const props: SiteOrdersDataGridProps = {
    error: false,
    loading: false,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
    onProblemOnlyChange: vi.fn(),
    onRetry: vi.fn(),
    onSearchChange: vi.fn(),
    onOpenOrder: vi.fn(),
    onView: vi.fn(),
    page: 1,
    pageSize: 20,
    problemOnly: false,
    rowCount: 1,
    rows: [row({})],
    ...overrides,
  };
  return { props, ...render(<SiteOrdersDataGrid {...props} />) };
}

describe('SiteOrdersDataGrid', () => {
  afterEach(cleanup);

  it('shows the order row with Kyiv time and the total, and no chip for a delivered order', () => {
    renderGrid();
    expect(screen.getByText('24.11.2026, 09:45')).toBeTruthy();
    expect(screen.getByText('№ 3F2B8C1E')).toBeTruthy();
    expect(screen.getByText('Ірина')).toBeTruthy();
    expect(screen.getByText(/7\s209,00/)).toBeTruthy();
    expect(screen.queryByText('Не надіслано')).toBeNull();
    expect(screen.queryByRole('checkbox', { name: /select/i })).toBeNull();
  });

  it('keeps the phone on one line and gives the name less room than the phone', () => {
    const columns = siteOrdersGridColumns(vi.fn(), vi.fn());
    const name = columns.find((column) => column.field === 'firstName')!;
    const phone = columns.find((column) => column.field === 'phone')!;
    expect(phone.minWidth).toBeGreaterThanOrEqual(180);
    expect(name.minWidth).toBeLessThan(phone.minWidth!);
    renderGrid();
    expect(getComputedStyle(screen.getByText('+380671234567')).whiteSpace).toBe('nowrap');
  });

  it('links the order made for 1C, with the 1C document number, without opening the site order', () => {
    const { props } = renderGrid({
      rows: [
        row({ oneCOrderId: 42, oneCOrderNumber: 'SO-20261126-42', oneCDocumentNumber: 'DOC-7' }),
      ],
    });

    expect(screen.getByRole('columnheader', { name: 'Замовлення 1С' })).toBeTruthy();
    expect(screen.getByText('1С № DOC-7')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити замовлення SO-20261126-42' }));
    expect(props.onOpenOrder).toHaveBeenCalledWith(42);
    expect(props.onView).not.toHaveBeenCalled();
  });

  it('leaves the 1C cell empty while the order for 1C is not made yet', () => {
    renderGrid();
    expect(screen.queryByRole('button', { name: /Відкрити замовлення SO-/ })).toBeNull();
  });

  it('shows the chip with the reason for a waiting order with an error and for a failed one', () => {
    renderGrid({
      rowCount: 2,
      rows: [
        row({ telegramStatus: 'pending', telegramLastError: 'Forbidden: bot was kicked' }),
        row({
          orderId: '4f2b8c1e-7a4d-4e1b-9c2a-1d2e3f4a5b6c',
          firstName: 'Олег',
          telegramStatus: 'failed',
          telegramLastError: 'chat not found',
        }),
      ],
    });
    expect(screen.getAllByText('Не надіслано')).toHaveLength(2);
    expect(
      screen.getByRole('img', { name: /Повторимо автоматично\. Остання помилка: Forbidden/ }),
    ).toBeTruthy();
    expect(
      screen.getByRole('img', { name: /Спроби .* закінчились\. chat not found/ }),
    ).toBeTruthy();
  });

  it('opens an order from the eye and from the row', () => {
    const { props } = renderGrid();
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути замовлення Ірина' }));
    fireEvent.click(screen.getByRole('row', { name: /Ірина/ }));
    expect(props.onView).toHaveBeenCalledTimes(2);
    expect(props.onView).toHaveBeenCalledWith('3f2b8c1e-7a4d-4e1b-9c2a-1d2e3f4a5b6c');
  });

  it('sends search and the problem switch to the page', async () => {
    const { props } = renderGrid();
    fireEvent.change(screen.getByPlaceholderText('Пошук за номером, ім’ям або телефоном'), {
      target: { value: '067' },
    });
    await waitFor(() => expect(props.onSearchChange).toHaveBeenCalledWith('067'));
    fireEvent.click(screen.getByRole('switch', { name: 'Лише з проблемою' }));
    expect(props.onProblemOnlyChange).toHaveBeenCalledWith(true);
  });

  it('shows the empty texts and a retry for a failed load', () => {
    const { rerender, props } = renderGrid({ rowCount: 0, rows: [] });
    expect(screen.getByText('Замовлень з сайту ще немає.')).toBeTruthy();
    rerender(<SiteOrdersDataGrid {...props} problemOnly rowCount={0} rows={[]} />);
    expect(screen.getByText('Нічого не знайдено.')).toBeTruthy();
    rerender(<SiteOrdersDataGrid {...props} error rowCount={0} rows={[]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(props.onRetry).toHaveBeenCalledOnce();
  });
});
