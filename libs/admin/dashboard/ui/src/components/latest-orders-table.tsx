import { SectionCard, StatusPill } from '@admin/shared/ui';
import { Box, Button, Link, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import type { DashboardOrder } from '@admin/dashboard/model';

const money = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
const time = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

/** The newest orders; only a 1C problem gets a mark. */
export function LatestOrdersTable({ orders }: { orders: readonly DashboardOrder[] }) {
  return (
    <SectionCard
      action={
        <Button href="/orders" sx={{ minHeight: 44 }}>
          Усі замовлення
        </Button>
      }
      title="Останні замовлення"
    >
      {orders.length === 0 ? (
        <Box color="text.secondary">Замовлень ще немає.</Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 560 }}>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Клієнт</TableCell>
                <TableCell>Створено</TableCell>
                <TableCell align="right">Сума, грн</TableCell>
                <TableCell>1С</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow hover key={order.orderId}>
                  <TableCell sx={{ fontWeight: 700 }}>
                    <Link href={`/orders/${order.orderId}`} underline="hover">
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{order.counterpartyName}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {time.format(new Date(order.createdAt))}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {money.format(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    {order.hasSyncProblem ? <StatusPill label="Не передано" tone="error" /> : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </SectionCard>
  );
}
