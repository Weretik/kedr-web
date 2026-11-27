import { Link, Stack, Typography } from '@mui/material';

import type { SiteOrderListItem } from '@admin/site-orders/model';

export type SiteOrderOneCLinkOrder = Pick<
  SiteOrderListItem,
  'oneCOrderId' | 'oneCOrderNumber' | 'oneCDocumentNumber'
>;

/**
 * The order made from a site order for 1C (KedrStore spec sales/009, R-015): its number opens it in «Історія
 * замовлень», and the 1C document number follows once 1C accepts it. Renders nothing until the order is made. The
 * click does not reach the table row, so it does not also open the site order.
 */
export function SiteOrderOneCLink({
  order,
  onOpenOrder,
}: {
  order: SiteOrderOneCLinkOrder;
  onOpenOrder: (orderId: number) => void;
}) {
  const { oneCOrderId, oneCOrderNumber, oneCDocumentNumber } = order;
  if (oneCOrderId === null || !oneCOrderNumber) return null;
  return (
    <Stack spacing={0.25} sx={{ alignItems: 'flex-start', minWidth: 0 }}>
      <Link
        aria-label={`Відкрити замовлення ${oneCOrderNumber}`}
        component="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenOrder(oneCOrderId);
        }}
        type="button"
        underline="hover"
        variant="body2"
      >
        {oneCOrderNumber}
      </Link>
      {oneCDocumentNumber && (
        <Typography color="text.secondary" variant="caption">
          1С № {oneCDocumentNumber}
        </Typography>
      )}
    </Stack>
  );
}
