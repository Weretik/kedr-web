import { useQuoteWorkspaceOrderMutation } from '@admin/orders/data-access';
import { renderHook, waitFor } from '@testing-library/react';

import { useOrderQuote } from './use-order-quote';

vi.mock('@admin/orders/data-access', () => ({ useQuoteWorkspaceOrderMutation: vi.fn() }));

describe('useOrderQuote', () => {
  it('shows the server stock error for the current customer and lines', async () => {
    const message = 'Недостатньо товару «Двері» на складі: доступно 1, потрібно 2.';
    const lines = [{ productId: '6', quantity: 2 }];
    const trigger = vi.fn(() => ({ unwrap: () => Promise.reject({ reason: 'unavailable_product', message }) }));
    vi.mocked(useQuoteWorkspaceOrderMutation).mockReturnValue([trigger, {}] as ReturnType<typeof useQuoteWorkspaceOrderMutation>);

    const { result } = renderHook(() => useOrderQuote('customer', lines));

    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.errorMessage).toBe(message);
    expect(trigger).toHaveBeenCalledWith({ counterpartyId: 'customer', lines: [{ productId: '6', quantity: 2 }] });
  });
});
