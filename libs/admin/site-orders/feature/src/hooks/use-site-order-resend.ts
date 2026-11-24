import { useResendSiteOrderToTelegramMutation } from '@admin/site-orders/data-access';
import { useState } from 'react';

const sentNotice = 'Замовлення поставлено в чергу на відправку';

/** What went wrong with a resend, in words a manager can act on (spec R-005). */
export function resendErrorMessage(error: unknown): string {
  const failure = (error ?? {}) as { status?: unknown; message?: unknown };
  if (failure.status === 404) return 'Замовлення не знайдено.';
  if (failure.status === 409 && typeof failure.message === 'string' && failure.message.trim())
    return failure.message;
  return 'Не вдалося поставити замовлення в чергу. Спробуйте ще раз.';
}

/**
 * «Надіслати в Telegram ще раз» for a failed order. Locked while the request runs; a success refreshes the order and the
 * list through the cache tag, a conflict refreshes the order so the page shows its current state.
 */
export function useSiteOrderResend(orderId: string, onConflict: () => void) {
  const [resend, { isLoading }] = useResendSiteOrderToTelegramMutation();
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    if (isLoading) return;
    setError(null);
    void resend(orderId)
      .unwrap()
      .then(() => setNotice(sentNotice))
      .catch((cause: unknown) => {
        setError(resendErrorMessage(cause));
        if ((cause as { status?: unknown } | undefined)?.status === 409) onConflict();
      });
  };

  return {
    error,
    notice,
    pending: isLoading,
    resend: run,
    clearError: () => setError(null),
    clearNotice: () => setNotice(null),
  };
}
