import { useResendSiteOrderToTelegramMutation } from '@admin/site-orders/data-access';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resendErrorMessage, useSiteOrderResend } from './use-site-order-resend';

vi.mock('@admin/site-orders/data-access', () => ({
  useResendSiteOrderToTelegramMutation: vi.fn(),
}));

const orderId = '3f2b8c1e-7a4d-4e1b-9c2a-1d2e3f4a5b6c';

function mockMutation(result: Promise<void>, isLoading = false) {
  const trigger = vi.fn(() => ({ unwrap: () => result }));
  vi.mocked(useResendSiteOrderToTelegramMutation).mockReturnValue([
    trigger,
    { isLoading },
  ] as unknown as ReturnType<typeof useResendSiteOrderToTelegramMutation>);
  return trigger;
}

describe('useSiteOrderResend', () => {
  beforeEach(() => vi.clearAllMocks());

  it('queues the order once and shows the success notice', async () => {
    const trigger = mockMutation(Promise.resolve());
    const { result } = renderHook(() => useSiteOrderResend(orderId, vi.fn()));
    act(() => result.current.resend());
    await waitFor(() =>
      expect(result.current.notice).toBe('Замовлення поставлено в чергу на відправку'),
    );
    expect(trigger).toHaveBeenCalledWith(orderId);
  });

  it('does not send a second request while the first one runs', () => {
    const trigger = mockMutation(new Promise(() => undefined), true);
    const { result } = renderHook(() => useSiteOrderResend(orderId, vi.fn()));
    act(() => result.current.resend());
    expect(trigger).not.toHaveBeenCalled();
    expect(result.current.pending).toBe(true);
  });

  it('shows the server text of a conflict and refreshes the order', async () => {
    mockMutation(Promise.reject({ status: 409, message: 'Замовлення вже надіслано в Telegram.' }));
    const onConflict = vi.fn();
    const { result } = renderHook(() => useSiteOrderResend(orderId, onConflict));
    act(() => result.current.resend());
    await waitFor(() => expect(result.current.error).toBe('Замовлення вже надіслано в Telegram.'));
    expect(onConflict).toHaveBeenCalledOnce();
  });

  it('words not found and other failures for the manager', () => {
    expect(resendErrorMessage({ status: 404, message: 'Not found' })).toBe(
      'Замовлення не знайдено.',
    );
    expect(resendErrorMessage({ status: 500, message: 'boom' })).toMatch(/Спробуйте ще раз/);
    expect(resendErrorMessage(undefined)).toMatch(/Спробуйте ще раз/);
  });
});
