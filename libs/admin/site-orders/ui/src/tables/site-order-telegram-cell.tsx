import { StatusPill } from '@admin/shared/ui';
import { siteOrderDeliveryIssue } from '@admin/site-orders/model';
import { Tooltip } from '@mui/material';

import type { SiteOrderListItem } from '@admin/site-orders/model';

/** Empty for a delivered order (spec R-003); a chip with the reason in its tooltip when Telegram has not got it. */
export function SiteOrderTelegramCell({ order }: { order: SiteOrderListItem }) {
  const issue = siteOrderDeliveryIssue(order);
  if (!issue) return null;
  return (
    <Tooltip title={issue.reason}>
      <span aria-label={`${issue.label}: ${issue.reason}`} role="img">
        <StatusPill label={issue.label} tone={issue.tone} />
      </span>
    </Tooltip>
  );
}
