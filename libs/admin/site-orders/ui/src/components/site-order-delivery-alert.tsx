import { siteOrderDeliveryIssue, formatSiteOrderTime } from '@admin/site-orders/model';
import { Alert, AlertTitle } from '@mui/material';

import type { SiteOrderDetail } from '@admin/site-orders/model';

/** Shown only when Telegram has not got the order: the error text and the time of the last attempt. */
export function SiteOrderDeliveryAlert({ order }: { order: SiteOrderDetail }) {
  const issue = siteOrderDeliveryIssue(order);
  if (!issue) return null;
  return (
    <Alert severity={issue.tone}>
      <AlertTitle>Замовлення не надіслано в Telegram</AlertTitle>
      {issue.reason}
      {order.telegramLastAttemptAtUtc
        ? ` Остання спроба: ${formatSiteOrderTime(order.telegramLastAttemptAtUtc)}.`
        : null}
    </Alert>
  );
}
