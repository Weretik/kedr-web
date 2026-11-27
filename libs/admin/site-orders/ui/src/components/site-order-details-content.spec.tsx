import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SiteOrderDetailsContent } from './site-order-details-content';

import type { SiteOrderDetail } from '@admin/site-orders/model';

const order = (overrides: Partial<SiteOrderDetail> = {}): SiteOrderDetail => ({
  orderId: '3f2b8c1e-7a4d-4e1b-9c2a-1d2e3f4a5b6c',
  placedAtUtc: '2026-11-24T07:45:00Z',
  firstName: 'Ірина',
  phone: '+38 (067) 123-45-67',
  total: 409.5,
  telegramStatus: 'sent',
  telegramSentAtUtc: '2026-11-24T07:45:02Z',
  telegramLastAttemptAtUtc: '2026-11-24T07:45:02Z',
  telegramLastError: null,
  comment: null,
  oneCOrderId: null,
  oneCOrderNumber: null,
  oneCDocumentNumber: null,
  items: [
    { productId: '27254', title: 'Ручка «Кедр»', unitPrice: 136.5, quantity: 3, amount: 409.5 },
  ],
  ...overrides,
});

describe('SiteOrderDetailsContent', () => {
  afterEach(cleanup);

  it('links the order made for 1C and says when it is not made yet', () => {
    const onOpenOrder = vi.fn();
    const { rerender } = render(
      <SiteOrderDetailsContent onOpenOrder={onOpenOrder} order={order()} />,
    );
    expect(screen.getByText('Ще не створено')).toBeTruthy();
    rerender(
      <SiteOrderDetailsContent
        onOpenOrder={onOpenOrder}
        order={order({
          oneCOrderId: 42,
          oneCOrderNumber: 'SO-20261126-42',
          oneCDocumentNumber: null,
        })}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити замовлення SO-20261126-42' }));
    expect(onOpenOrder).toHaveBeenCalledWith(42);
  });

  it('shows the buyer comment only when there is one', () => {
    const { rerender } = render(<SiteOrderDetailsContent onOpenOrder={vi.fn()} order={order()} />);
    expect(screen.queryByText('Коментар покупця')).toBeNull();
    rerender(
      <SiteOrderDetailsContent
        onOpenOrder={vi.fn()}
        order={order({ comment: 'Дзвоніть після 14:00' })}
      />,
    );
    expect(screen.getByText('Коментар покупця')).toBeTruthy();
    expect(screen.getByText('Дзвоніть після 14:00')).toBeTruthy();
  });

  it('shows the buyer, a phone link, the lines with sums and the total', () => {
    render(<SiteOrderDetailsContent onOpenOrder={vi.fn()} order={order()} />);
    expect(screen.getByRole('heading', { name: 'Ірина' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '+38 (067) 123-45-67' }).getAttribute('href')).toBe(
      'tel:+380671234567',
    );
    expect(screen.getByText('Надіслано 24.11.2026, 09:45')).toBeTruthy();
    expect(screen.getByText('№ 3F2B8C1E')).toBeTruthy();
    expect(screen.queryByText('3f2b8c1e-7a4d-4e1b-9c2a-1d2e3f4a5b6c')).toBeNull();
    const table = screen.getByRole('table', { name: 'Товари замовлення' });
    expect(within(table).getByText('Ручка «Кедр»')).toBeTruthy();
    expect(within(table).getByText('136,50')).toBeTruthy();
    expect(within(table).getAllByText('409,50')).toHaveLength(2);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows the problem with the error text when Telegram has not got the order', () => {
    render(
      <SiteOrderDetailsContent
        order={order({
          telegramStatus: 'failed',
          telegramSentAtUtc: null,
          telegramLastError: 'Forbidden: bot was kicked from the group chat',
        })}
      />,
    );
    const alert = screen.getByRole('alert');
    expect(within(alert).getByText('Замовлення не надіслано в Telegram')).toBeTruthy();
    expect(alert.textContent).toContain('Forbidden: bot was kicked from the group chat');
    expect(alert.textContent).toContain('Остання спроба: 24.11.2026, 09:45.');
    expect(screen.getByText('Ще не надіслано')).toBeTruthy();
  });
});
