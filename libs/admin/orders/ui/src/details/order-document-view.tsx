import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import {
  Alert,
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { OrderStatusChip } from '../components/order-status-chip';
import { PriceAdjustmentText } from '../components/price-adjustment-text';

import type { PricedLine } from '@admin/orders/model';

interface Props {
  customerName: string;
  counterpartyId: string;
  reference: string;
  date: string;
  status?: string;
  note?: string | null;
  lines: PricedLine[];
  totalAmount: number | null;
  pricingUnavailable?: boolean;
}
const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });
const numeric = { fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } as const;

export function OrderDocumentView({
  customerName,
  counterpartyId,
  reference,
  date,
  status,
  note,
  lines,
  totalAmount,
  pricingUnavailable,
}: Props) {
  const adjusted = lines.some((line) => line.priceAdjustment);
  return (
    <Stack spacing={3}>
      {pricingUnavailable && (
        <Alert severity="warning">
          Актуальна ціна або товар недоступні. Чернетку можна виправити чи видалити; оформлення
          потребує нового розрахунку.
        </Alert>
      )}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <SectionCard eyebrow="Клієнт" title={customerName}>
          <DetailFieldList>
            <DetailField label="ID клієнта" value={counterpartyId} />
          </DetailFieldList>
        </SectionCard>
        <SectionCard eyebrow="Документ" title={reference}>
          <DetailFieldList columns={2}>
            <DetailField label="Дата" value={dateFormat.format(new Date(date))} />
            {status && <DetailField label="Стан 1С" value={<OrderStatusChip status={status} />} />}
            {note && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <DetailField label="Примітка" value={note} />
              </Box>
            )}
          </DetailFieldList>
        </SectionCard>
      </Box>
      <SectionCard title="Товари">
        <TableContainer>
          <Table size="small" sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>Товар</TableCell>
                <TableCell align="right">Кількість</TableCell>
                <TableCell align="right">Ціна</TableCell>
                {adjusted && <TableCell align="right">Знижка/Націнка за шт.</TableCell>}
                <TableCell align="right">Сума</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lines.map((line) => (
                <TableRow key={line.productId}>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {line.productName ?? `ID ${line.productId}`}
                  </TableCell>
                  <TableCell align="right" sx={numeric}>
                    {line.quantity}
                  </TableCell>
                  <TableCell align="right" sx={numeric}>
                    {line.unitPrice === null ? '—' : money.format(line.unitPrice)}
                  </TableCell>
                  {adjusted && (
                    <TableCell align="right" sx={numeric}>
                      <PriceAdjustmentText value={line.priceAdjustment} />
                    </TableCell>
                  )}
                  <TableCell align="right" sx={numeric}>
                    {line.lineAmount === null ? '—' : money.format(line.lineAmount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'baseline', justifyContent: 'flex-end' }}
        >
          {adjusted && (
            <Typography sx={numeric} variant="body2">
              <PriceAdjustmentText
                label
                value={lines.reduce(
                  (sum, line) => sum + (line.priceAdjustment ?? 0) * line.quantity,
                  0,
                )}
              />
            </Typography>
          )}
          <Typography color="text.secondary" variant="subtitle2">
            Разом
          </Typography>
          <Typography component="p" sx={numeric} variant="h5">
            {totalAmount === null ? 'Недоступно' : money.format(totalAmount)}
          </Typography>
        </Stack>
      </SectionCard>
    </Stack>
  );
}
