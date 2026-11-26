import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RetailPriceResult } from './retail-price-result';

const status = {
  priceTypeId: 11,
  priceTypeName: 'Розница халтмаг 30%',
  lockedCount: 3,
  lastLockedAt: null,
};

describe('RetailPriceResult', () => {
  it('shows the numbers and the codes it could not use', () => {
    render(
      <RetailPriceResult
        result={{
          changed: 2,
          unchanged: 1,
          notFoundCount: 1,
          notFoundCodes: ['999'],
          withoutPriceCount: 1,
          withoutPriceCodes: ['5'],
          status,
        }}
      />,
    );

    expect(screen.getByText('Змінено: 2 · Без змін: 1')).toBeTruthy();
    expect(screen.getByText(/Не знайдено товарів: 1\. Коди: 999/)).toBeTruthy();
    expect(screen.getByText(/Без ціни: 1\. Коди: 5/)).toBeTruthy();
  });

  it('shows no warning when every row was used', () => {
    render(
      <RetailPriceResult
        result={{
          changed: 5,
          unchanged: 0,
          notFoundCount: 0,
          notFoundCodes: [],
          withoutPriceCount: 0,
          withoutPriceCodes: [],
          status,
        }}
      />,
    );

    expect(screen.queryByRole('alert')).toBeNull();
  });
});
