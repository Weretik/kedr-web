import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Alert, Card, CardContent, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';

import type { OrderInputLine, OrderQuote } from '@admin/orders/model';

interface Props { lines: OrderInputLine[]; quote: OrderQuote | null; onChange: (lines: OrderInputLine[]) => void }
const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
export function OrderLineEditor({ lines, quote, onChange }: Props) {
  return <Card variant="outlined"><CardContent>
    <Typography component="h2" variant="h6" sx={{ mb: 2 }}>Товари</Typography>
    {lines.length === 0 ? <Alert severity="info">Товарів ще немає. Додайте їх на сторінці товарів.</Alert> :
      <TableContainer><Table size="small" sx={{ minWidth: 490 }}><TableHead><TableRow><TableCell>Товар</TableCell><TableCell>Кількість</TableCell><TableCell align="right">Ціна</TableCell><TableCell align="right">Сума</TableCell><TableCell align="right">Дія</TableCell></TableRow></TableHead>
        <TableBody>{lines.map((line) => { const current = quote?.lines.find((item) => item.productId === line.productId); return <TableRow key={line.productId}>
          <TableCell>{current?.productName ?? `ID ${line.productId}`}</TableCell>
          <TableCell><TextField aria-label={`Кількість товару ${line.productId}`} slotProps={{ htmlInput: { min: 1, max: 1000000 } }} onChange={(event) => { const quantity = Number(event.target.value); if (Number.isSafeInteger(quantity) && quantity > 0) onChange(lines.map((item) => item.productId === line.productId ? { ...item, quantity } : item)); }} size="small" sx={{ width: 100 }} type="number" value={line.quantity} /></TableCell>
          <TableCell align="right">{current?.unitPrice == null ? '—' : money.format(current.unitPrice)}</TableCell><TableCell align="right">{current?.lineAmount == null ? '—' : money.format(current.lineAmount)}</TableCell>
          <TableCell align="right"><Tooltip title="Видалити товар"><IconButton aria-label={`Видалити товар ${line.productId}`} onClick={() => onChange(lines.filter((item) => item.productId !== line.productId))} size="small"><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip></TableCell>
        </TableRow>; })}</TableBody>
      </Table></TableContainer>}
    <Stack sx={{ alignItems: 'flex-end', mt: 2 }}><Typography variant="h6">Разом: {quote ? money.format(quote.totalAmount) : 'Очікуємо розрахунок'}</Typography></Stack>
  </CardContent></Card>;
}
