import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RetailPricesButton } from './retail-prices-button';

vi.mock('./retail-prices-panel', () => ({
  RetailPricesPanel: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">panel</div> : null,
}));

describe('RetailPricesButton', () => {
  it('opens the retail prices panel', () => {
    render(<RetailPricesButton />);
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Завантажити роздрібні ціни' }));

    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
