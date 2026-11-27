import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { OrderSyncSendNowButton } from './order-sync-send-now-button';

const retry = vi.hoisted(() => vi.fn());
const state = vi.hoisted(() => ({ isLoading: false, error: undefined as unknown }));
vi.mock('@admin/orders/data-access', () => ({
  useRetryOrderSyncMutation: () => [retry, { ...state, reset: vi.fn() }],
}));

describe('OrderSyncSendNowButton', () => {
  beforeEach(() => {
    retry.mockReset();
    state.isLoading = false;
    state.error = undefined;
  });

  it('sends the waiting order now and reports it', async () => {
    retry.mockReturnValue({ unwrap: () => Promise.resolve() });
    const onSent = vi.fn();
    render(<OrderSyncSendNowButton onSent={onSent} orderId={42} />);

    fireEvent.click(screen.getByRole('button', { name: 'Надіслати зараз' }));

    expect(retry).toHaveBeenCalledWith({ orderId: 42, reason: 'Надіслати зараз' });
    await waitFor(() => expect(onSent).toHaveBeenCalledTimes(1));
  });

  it('is locked while the request runs', () => {
    state.isLoading = true;
    render(<OrderSyncSendNowButton onSent={vi.fn()} orderId={42} />);

    expect(screen.getByRole('button', { name: 'Надіслати зараз' }).hasAttribute('disabled')).toBe(
      true,
    );
  });

  it('explains a conflict', () => {
    state.error = { status: 409 };
    render(<OrderSyncSendNowButton onSent={vi.fn()} orderId={42} />);

    expect(screen.getByRole('alert').textContent).toContain('Стан замовлення вже змінився');
  });
});
