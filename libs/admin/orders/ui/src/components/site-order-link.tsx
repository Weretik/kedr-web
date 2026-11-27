import { Link } from '@mui/material';

/**
 * «№ 52992220»: the site order an order was made from, as a link that opens it (KedrStore spec sales/009, R-015). The
 * click does not reach the table row, so it does not also open the order.
 */
export function SiteOrderLink({
  siteOrderId,
  siteOrderNumber,
  onOpen,
}: {
  siteOrderId: string;
  siteOrderNumber: string;
  onOpen: (siteOrderId: string) => void;
}) {
  return (
    <Link
      aria-label={`Відкрити замовлення з сайту № ${siteOrderNumber}`}
      component="button"
      onClick={(event) => {
        event.stopPropagation();
        onOpen(siteOrderId);
      }}
      type="button"
      underline="hover"
      variant="body2"
    >
      № {siteOrderNumber}
    </Link>
  );
}
