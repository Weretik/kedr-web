import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { OrderSyncRetryPanel } from './order-sync-retry-panel';

const retry = vi.hoisted(() => vi.fn());
const state = vi.hoisted(() => ({ isLoading: false, error: undefined as unknown }));
vi.mock('@admin/orders/data-access', () => ({
  useRetryOrderSyncMutation: () => [retry, { ...state, reset: vi.fn() }],
}));

function renderPanel(onRetried = vi.fn(), onClose = vi.fn()) {
  render(
    <OrderSyncRetryPanel
      onClose={onClose}
      onRetried={onRetried}
      open
      orderId={42}
      orderNumber="SO-20261116-42"
    />,
  );
  return { onRetried, onClose };
}

describe('OrderSyncRetryPanel', () => {
  beforeEach(() => {
    retry.mockReset();
    state.isLoading = false;
    state.error = undefined;
  });

  it('asks what was fixed before sending anything', () => {
    renderPanel();

    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));

    expect(screen.getByText(/Вкажіть, що виправили/)).toBeTruthy();
    expect(retry).not.toHaveBeenCalled();
  });

  it('sends the trimmed reason once and closes after the order is queued', async () => {
    retry.mockReturnValue({ unwrap: () => Promise.resolve() });
    const { onRetried, onClose } = renderPanel();

    fireEvent.change(screen.getByRole('textbox', { name: 'Що виправлено' }), {
      target: { value: '  Виправили код клієнта  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));

    expect(retry).toHaveBeenCalledWith({ orderId: 42, reason: 'Виправили код клієнта' });
    await waitFor(() => expect(onRetried).toHaveBeenCalledOnce());
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('explains a conflict: the order was accepted or queued meanwhile', () => {
    state.error = { status: 409 };
    renderPanel();

    expect(screen.getByText(/Стан замовлення вже змінився/)).toBeTruthy();
  });
});
