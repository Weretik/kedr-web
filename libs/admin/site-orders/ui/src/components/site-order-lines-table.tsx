import { SectionCard } from '@admin/shared/ui';
import { formatSiteOrderMoney } from '@admin/site-orders/model';
import { Box, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';

import type { SiteOrderLine } from '@admin/site-orders/model';

/** What was ordered: code, name, price, quantity, sum, and the total under the lines. */
export function SiteOrderLinesTable({
  items,
  total,
}: {
  items: readonly SiteOrderLine[];
  total: number;
}) {
  return (
    <SectionCard title="Товари">
      <Box sx={{ overflowX: 'auto' }}>
        <Table aria-label="Товари замовлення" size="small" sx={{ minWidth: 560 }}>
          <TableHead>
            <TableRow>
              <TableCell>Код</TableCell>
              <TableCell>Назва</TableCell>
              <TableCell align="right">Ціна, грн</TableCell>
              <TableCell align="right">Кількість</TableCell>
              <TableCell align="right">Сума, грн</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((line, index) => (
              <TableRow key={`${line.productId}-${index}`}>
                <TableCell>{line.productId}</TableCell>
                <TableCell sx={{ overflowWrap: 'anywhere' }}>{line.title}</TableCell>
                <TableCell align="right">{formatSiteOrderMoney(line.unitPrice)}</TableCell>
                <TableCell align="right">{line.quantity}</TableCell>
                <TableCell align="right">{formatSiteOrderMoney(line.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} sx={{ fontWeight: 700 }}>
                Разом
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {formatSiteOrderMoney(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Box>
    </SectionCard>
  );
}
