import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import { Alert, Card, CardContent, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';

import type { CatalogLineInfo, OrderInputLine, OrderQuote } from '@admin/orders/model';

interface Props { lines: OrderInputLine[]; quote: OrderQuote | null; previewQuote?: OrderQuote | null; catalogLines?: CatalogLineInfo[]; onChange: (lines: OrderInputLine[]) => void }
const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
export function OrderLineEditor({ lines, quote, previewQuote, catalogLines = [], onChange }: Props) {
  const catalog = new Map(catalogLines.map((item) => [item.productId, item]));
  const setQuantity = (productId: string, quantity: number) => {
    if (Number.isSafeInteger(quantity) && quantity > 0 && quantity <= 1_000_000)
      onChange(lines.map((item) => item.productId === productId ? { ...item, quantity } : item));
  };
  const totals = lines.map((line) => {
    const current = quote?.lines.find((item) => item.productId === line.productId);
    const previous = previewQuote?.lines.find((item) => item.productId === line.productId);
    const unitPrice = current?.unitPrice ?? previous?.unitPrice ?? catalog.get(line.productId)?.unitPrice;
    return unitPrice == null ? null : Math.round(unitPrice * line.quantity * 100) / 100;
  });
  const previewTotal = totals.every((amount) => amount !== null)
    ? totals.reduce<number>((sum, amount) => sum + (amount ?? 0), 0) : null;
  return <Card variant="outlined"><CardContent>
    <Typography component="h2" variant="h6" sx={{ mb: 2 }}>Товари</Typography>
    {lines.length === 0 ? <Alert severity="info">Товарів ще немає. Додайте їх на сторінці товарів.</Alert> :
      <TableContainer><Table size="small" sx={{ minWidth: 490 }}><TableHead><TableRow><TableCell>Товар</TableCell><TableCell>Кількість</TableCell><TableCell align="right">Ціна</TableCell><TableCell align="right">Сума</TableCell><TableCell align="right">Дія</TableCell></TableRow></TableHead>
        <TableBody>{lines.map((line) => { const current = quote?.lines.find((item) => item.productId === line.productId); const previous = previewQuote?.lines.find((item) => item.productId === line.productId); const product = catalog.get(line.productId); const unitPrice = current?.unitPrice ?? previous?.unitPrice ?? product?.unitPrice; const amount = current?.lineAmount ?? (unitPrice == null ? null : Math.round(unitPrice * line.quantity * 100) / 100); return <TableRow key={line.productId}>
          <TableCell>{current?.productName ?? previous?.productName ?? product?.productName ?? 'Назва товару недоступна'}</TableCell>
          <TableCell><Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <IconButton aria-label={`Зменшити кількість товару ${line.productId}`} disabled={line.quantity <= 1} onClick={() => setQuantity(line.productId, line.quantity - 1)} size="small"><RemoveIcon fontSize="small" /></IconButton>
            <TextField aria-label={`Кількість товару ${line.productId}`} slotProps={{ htmlInput: { min: 1, max: 1000000 } }} onChange={(event) => setQuantity(line.productId, Number(event.target.value))} size="small" sx={{ width: 82 }} type="number" value={line.quantity} />
            <IconButton aria-label={`Збільшити кількість товару ${line.productId}`} disabled={line.quantity >= 1_000_000} onClick={() => setQuantity(line.productId, line.quantity + 1)} size="small"><AddIcon fontSize="small" /></IconButton>
          </Stack></TableCell>
          <TableCell align="right">{unitPrice == null ? '—' : money.format(unitPrice)}</TableCell><TableCell align="right">{amount == null ? '—' : money.format(amount)}</TableCell>
          <TableCell align="right"><Tooltip title="Видалити товар"><IconButton aria-label={`Видалити товар ${line.productId}`} onClick={() => onChange(lines.filter((item) => item.productId !== line.productId))} size="small"><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip></TableCell>
        </TableRow>; })}</TableBody>
      </Table></TableContainer>}
    <Stack sx={{ alignItems: 'flex-end', mt: 2 }}><Typography variant="h6">{quote ? 'Разом' : 'Разом (попередньо)'}: {quote ? money.format(quote.totalAmount) : previewTotal === null ? 'Очікуємо розрахунок' : money.format(previewTotal)}</Typography></Stack>
  </CardContent></Card>;
}
