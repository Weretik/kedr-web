import type { SiteOrderTelegramStatus } from '../entities/site-order';

/** What the Admin says about a delivery problem; null when there is nothing to say. */
export interface SiteOrderDeliveryIssue {
  /** `warning`: still retrying after an error; `error`: retries are over. */
  tone: 'warning' | 'error';
  label: string;
  reason: string;
}

const noReason = 'Причину не отримано.';

/**
 * A delivered order and an order waiting for its first attempt are fine (no badge, spec R-003); a waiting order with an
 * error is still retried automatically; a failed order needs «Надіслати в Telegram ще раз».
 */
export function siteOrderDeliveryIssue(order: {
  telegramStatus: SiteOrderTelegramStatus;
  telegramLastError: string | null;
}): SiteOrderDeliveryIssue | null {
  const reason = order.telegramLastError?.trim();
  if (order.telegramStatus === 'failed')
    return {
      tone: 'error',
      label: 'Не надіслано',
      reason: `Спроби надіслати в Telegram закінчились. ${reason || noReason}`,
    };
  if (order.telegramStatus === 'pending' && reason)
    return {
      tone: 'warning',
      label: 'Не надіслано',
      reason: `Повторимо автоматично. Остання помилка: ${reason}`,
    };
  return null;
}
