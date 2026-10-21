import { Alert, Box, Card, CardContent, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import type { PricedLine } from '@admin/orders/model';

interface Props {
  customerName: string; counterpartyId: string; reference: string; date: string;
  status?: string; note?: string | null; lines: PricedLine[];
  totalAmount: number | null; pricingUnavailable?: boolean;
}
const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

export function OrderDocumentView({ customerName, counterpartyId, reference, date, status, note, lines, totalAmount, pricingUnavailable }: Props) {
  return <Stack spacing={3}>
    {pricingUnavailable && <Alert severity="warning">Актуальна ціна або товар недоступні. Чернетку можна виправити чи видалити; оформлення потребує нового розрахунку.</Alert>}
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' } }}>
      <Card variant="outlined"><CardContent><Stack spacing={1}>
        <Typography color="text.secondary" variant="subtitle2">Клієнт</Typography>
        <Typography variant="h6">{customerName}</Typography>
        <Typography color="text.secondary">ID: {counterpartyId}</Typography>
      </Stack></CardContent></Card>
      <Card variant="outlined"><CardContent><Stack spacing={1}>
        <Typography color="text.secondary" variant="subtitle2">Документ</Typography>
        <Typography variant="h6">{reference}</Typography>
        <Typography color="text.secondary">{dateFormat.format(new Date(date))}</Typography>
        {status && <Typography>Стан 1C: {status}</Typography>}
        {note && <Typography sx={{ overflowWrap: 'anywhere' }}>Примітка: {note}</Typography>}
      </Stack></CardContent></Card>
    </Box>
    <Card variant="outlined"><CardContent><Typography component="h2" variant="h6" sx={{ mb: 2 }}>Товари</Typography>
      <TableContainer><Table size="small" sx={{ minWidth: 500 }}><TableHead><TableRow><TableCell>Товар</TableCell><TableCell align="right">Кількість</TableCell><TableCell align="right">Ціна</TableCell><TableCell align="right">Сума</TableCell></TableRow></TableHead>
        <TableBody>{lines.map((line) => <TableRow key={line.productId}><TableCell>{line.productName ?? `ID ${line.productId}`}</TableCell><TableCell align="right">{line.quantity}</TableCell><TableCell align="right">{line.unitPrice === null ? '—' : money.format(line.unitPrice)}</TableCell><TableCell align="right">{line.lineAmount === null ? '—' : money.format(line.lineAmount)}</TableCell></TableRow>)}</TableBody>
      </Table></TableContainer>
      <Divider sx={{ my: 2 }} /><Stack sx={{ alignItems: 'flex-end' }}><Typography variant="h6">Разом: {totalAmount === null ? 'Недоступно' : money.format(totalAmount)}</Typography></Stack>
    </CardContent></Card>
  </Stack>;
}
