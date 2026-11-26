import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RetailPriceStatus } from './retail-price-status';

const status = (lockedCount: number) => ({
  priceTypeId: 11,
  priceTypeName: 'Розница халтмаг 30%',
  lockedCount,
  lastLockedAt: null,
});

describe('RetailPriceStatus', () => {
  it('shows only the price type when nothing is locked', () => {
    render(
      <RetailPriceStatus
        busy={false}
        onRetry={vi.fn()}
        onUnlock={vi.fn()}
        status={status(0)}
        statusError={false}
      />,
    );

    expect(screen.getByText('Тип ціни: «Розница халтмаг 30%»')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Повернути ціни під 1С' })).toBeNull();
  });

  it('asks before giving the locked prices back to 1C', () => {
    const onUnlock = vi.fn();
    render(
      <RetailPriceStatus
        busy={false}
        onRetry={vi.fn()}
        onUnlock={onUnlock}
        status={status(3)}
        statusError={false}
      />,
    );

    expect(screen.getByText('З 1С не оновлюються 3 ціни')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Повернути ціни під 1С' }));
    expect(screen.getByText(/Повернути 3 ціни під 1С\?/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Повернути' }));

    expect(onUnlock).toHaveBeenCalledTimes(1);
  });

  it('offers a retry when the status did not load', () => {
    const onRetry = vi.fn();
    render(
      <RetailPriceStatus
        busy={false}
        onRetry={onRetry}
        onUnlock={vi.fn()}
        status={undefined}
        statusError
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
