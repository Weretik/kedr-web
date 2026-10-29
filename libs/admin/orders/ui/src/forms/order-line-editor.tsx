import { SectionCard } from '@admin/shared/ui';
import {
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { priceLine } from './order-lines/line-pricing';
import { PriceAdjustmentText } from '../components/price-adjustment-text';
import { OrderLineRow } from './order-lines/order-line-row';

import type { CatalogLineInfo, OrderInputLine, OrderQuote } from '@admin/orders/model';

interface Props {
  lines: OrderInputLine[];
  quote: OrderQuote | null;
  previewQuote?: OrderQuote | null;
  /** Retail catalog names and prices; prices are shown only until a customer is chosen. */
  catalogLines?: CatalogLineInfo[];
  /** The chosen customer's unit prices by product ID. */
  customerPrices?: Record<string, number | null>;
  hasCustomer?: boolean;
  onChange: (lines: OrderInputLine[]) => void;
}
const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
const numeric = { fontVariantNumeric: 'tabular-nums' } as const;

export function OrderLineEditor({
  lines,
  quote,
  previewQuote,
  catalogLines = [],
  customerPrices,
  hasCustomer = true,
  onChange,
}: Props) {
  const catalog = new Map(catalogLines.map((item) => [item.productId, item]));
  const sources = { quote, previewQuote, customerPrices, hasCustomer, catalog };
  const priced = lines.map((line) => priceLine(line, sources));
  const update = (productId: string, change: Partial<OrderInputLine>) =>
    onChange(lines.map((item) => (item.productId === productId ? { ...item, ...change } : item)));
  const setQuantity = (productId: string, quantity: number) => {
    if (Number.isSafeInteger(quantity) && quantity > 0 && quantity <= 1_000_000)
      update(productId, { quantity });
  };
  const previewTotal = priced.every((line) => line.lineAmount !== null)
    ? Math.round(priced.reduce((sum, line) => sum + (line.lineAmount ?? 0), 0) * 100) / 100
    : null;
  const adjustmentTotal =
    Math.round(
      lines.reduce((sum, line) => sum + (line.priceAdjustment ?? 0) * line.quantity, 0) * 100,
    ) / 100;
  return (
    <SectionCard title="Товари">
      {lines.length === 0 ? (
        <Alert severity="info">Товарів ще немає. Додайте їх на сторінці товарів.</Alert>
      ) : (
        <TableContainer>
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>Товар</TableCell>
                <TableCell>Кількість</TableCell>
                <TableCell align="right">
                  {hasCustomer ? 'Ціна клієнта' : 'Ціна (роздріб)'}
                </TableCell>
                <TableCell align="right">Знижка/Націнка, ₴ за шт.</TableCell>
                <TableCell align="right">Сума</TableCell>
                <TableCell align="right">Дія</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lines.map((line, index) => (
                <OrderLineRow
                  key={line.productId}
                  line={line}
                  pricing={priced[index]}
                  onAdjustment={(priceAdjustment) => update(line.productId, { priceAdjustment })}
                  onQuantity={(quantity) => setQuantity(line.productId, quantity)}
                  onRemove={() =>
                    onChange(lines.filter((item) => item.productId !== line.productId))
                  }
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {lines.length > 0 && !hasCustomer && (
        <Typography color="text.secondary" variant="body2">
          Показано роздрібні ціни. Оберіть клієнта, щоб побачити його ціни.
        </Typography>
      )}
      <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
        {adjustmentTotal !== 0 && (
          <Typography variant="body2">
            <PriceAdjustmentText label value={adjustmentTotal} />
          </Typography>
        )}
        <Typography sx={numeric} variant="h6">
          {quote ? 'Разом' : 'Разом (попередньо)'}:{' '}
          {quote
            ? money.format(quote.totalAmount)
            : previewTotal === null
              ? 'Очікуємо розрахунок'
              : money.format(previewTotal)}
        </Typography>
      </Stack>
    </SectionCard>
  );
}
