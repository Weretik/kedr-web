import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { OrderSyncCard } from './order-sync-card';

import type { OrderSyncState } from '../components/order-sync-note';

const sync = (overrides: Partial<OrderSyncState>): OrderSyncState => ({
  syncStatus: 'Pending',
  syncError: null,
  syncAttempts: 0,
  syncLastAttemptAtUtc: null,
  syncNextAttemptAtUtc: null,
  ...overrides,
});

describe('OrderSyncCard', () => {
  it('shows an accepted order with its 1C document and no problem details or retry', () => {
    render(
      <OrderSyncCard
        oneCDocumentNumber="DOC-7"
        onRetry={vi.fn()}
        sync={sync({ syncStatus: 'Accepted', syncAttempts: 1 })}
      />,
    );

    const card = screen.getByRole('region', { name: 'Стан відправлення' });
    expect(card.textContent).toContain('Прийнято в 1С');
    expect(card.textContent).toContain('DOC-7');
    expect(card.textContent).not.toContain('Спроб');
    expect(screen.queryByRole('button', { name: 'Повторити' })).toBeNull();
  });

  it('shows the reason, attempts and times of a dead letter and offers a retry', () => {
    const onRetry = vi.fn();
    render(
      <OrderSyncCard
        oneCDocumentNumber={null}
        onRetry={onRetry}
        sync={sync({
          syncStatus: 'DeadLetter',
          syncError: '1С не відповіла.',
          syncAttempts: 10,
          syncLastAttemptAtUtc: '2026-11-16T10:00:00Z',
        })}
      />,
    );

    const card = screen.getByRole('region', { name: 'Стан відправлення' });
    expect(card.textContent).toContain('Потрібна перевірка');
    expect(card.textContent).toContain('1С не відповіла.');
    expect(card.textContent).toContain('Спроб10');
    expect(card.textContent).toContain('Остання спроба');
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('shows the next attempt of a scheduled retry without a manual retry', () => {
    render(
      <OrderSyncCard
        oneCDocumentNumber={null}
        onRetry={vi.fn()}
        sync={sync({
          syncStatus: 'RetryScheduled',
          syncError: 'Timeout',
          syncAttempts: 2,
          syncNextAttemptAtUtc: '2026-11-16T10:05:00Z',
        })}
      />,
    );

    expect(screen.getByRole('region', { name: 'Стан відправлення' }).textContent).toContain(
      'Наступна спроба',
    );
    expect(screen.queryByRole('button', { name: 'Повторити' })).toBeNull();
  });
});
