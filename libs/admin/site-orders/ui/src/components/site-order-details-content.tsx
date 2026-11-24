import { Stack } from '@mui/material';

import { SiteOrderDeliveryAlert } from './site-order-delivery-alert';
import { SiteOrderLinesTable } from './site-order-lines-table';
import { SiteOrderMainCard } from './site-order-main-card';

import type { SiteOrderDetail } from '@admin/site-orders/model';

/** Read-only detail of a site order (spec R-004): main card, delivery problem, lines. */
export function SiteOrderDetailsContent({ order }: { order: SiteOrderDetail }) {
  return (
    <Stack spacing={3} sx={{ minWidth: 0 }}>
      <SiteOrderMainCard order={order} />
      <SiteOrderDeliveryAlert order={order} />
      <SiteOrderLinesTable items={order.items} total={order.total} />
    </Stack>
  );
}
