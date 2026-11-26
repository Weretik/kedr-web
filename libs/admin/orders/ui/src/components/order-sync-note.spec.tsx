import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { OrderSyncNote } from './order-sync-note';

import type { OrderSyncState } from './order-sync-note';

const longError = `FaultException: ${'Не найден тип цен контрагента 000001588. '.repeat(5)}`.trim();

const problem: OrderSyncState = {
  syncStatus: 'RetryScheduled',
  syncError: longError,
  syncAttempts: 3,
  syncLastAttemptAtUtc: '2026-11-26T13:30:00Z',
  syncNextAttemptAtUtc: null,
};

describe('OrderSyncNote', () => {
  it('opens the whole 1C error on click without opening the row', () => {
    const rowClick = vi.fn();
    document.body.addEventListener('click', rowClick);
    render(<OrderSyncNote sync={problem} />);

    fireEvent.click(screen.getByRole('button', { name: 'Показати повний опис помилки 1С' }));

    expect(screen.getByText('Помилка 1С')).toBeTruthy();
    expect(screen.getByText(longError)).toBeTruthy();
    expect(screen.getByText('Спроб: 3')).toBeTruthy();
    expect(rowClick).not.toHaveBeenCalled();
    document.body.removeEventListener('click', rowClick);
  });

  it('shows nothing for an order without a problem', () => {
    const { container } = render(
      <OrderSyncNote sync={{ ...problem, syncStatus: 'Accepted', syncError: null }} />,
    );

    expect(container.textContent).toBe('');
  });
});
