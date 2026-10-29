import { priceAdjustmentTone } from '@admin/orders/model';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { PriceAdjustmentField } from './price-adjustment-field';

import type { LinePricing } from './line-pricing';
import type { OrderInputLine } from '@admin/orders/model';

interface Props {
  line: OrderInputLine;
  pricing: LinePricing;
  onQuantity: (quantity: number) => void;
  onAdjustment: (value: number) => void;
  onRemove: () => void;
}
const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
const numeric = { fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } as const;

export function OrderLineRow({ line, pricing, onQuantity, onAdjustment, onRemove }: Props) {
  const adjustment = line.priceAdjustment ?? 0;
  const tone = priceAdjustmentTone(adjustment);
  return (
    <TableRow>
      <TableCell>{pricing.productName}</TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <IconButton
            aria-label={`Зменшити кількість товару ${line.productId}`}
            disabled={line.quantity <= 1}
            onClick={() => onQuantity(line.quantity - 1)}
            size="small"
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <TextField
            aria-label={`Кількість товару ${line.productId}`}
            slotProps={{ htmlInput: { min: 1, max: 1000000 } }}
            onChange={(event) => onQuantity(Number(event.target.value))}
            size="small"
            sx={{ width: 82 }}
            type="number"
            value={line.quantity}
          />
          <IconButton
            aria-label={`Збільшити кількість товару ${line.productId}`}
            disabled={line.quantity >= 1_000_000}
            onClick={() => onQuantity(line.quantity + 1)}
            size="small"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
      </TableCell>
      <TableCell align="right" sx={numeric}>
        {pricing.baseUnitPrice === null ? '—' : money.format(pricing.baseUnitPrice)}
        {tone !== 'none' && pricing.unitPrice !== null && (
          <Typography
            color={tone === 'discount' ? 'error.main' : 'success.main'}
            component="div"
            sx={numeric}
            variant="caption"
          >
            {money.format(pricing.unitPrice)} за шт.
          </Typography>
        )}
      </TableCell>
      <TableCell align="right">
        <PriceAdjustmentField
          productId={line.productId}
          value={adjustment}
          onChange={onAdjustment}
        />
      </TableCell>
      <TableCell align="right" sx={numeric}>
        {pricing.lineAmount === null ? '—' : money.format(pricing.lineAmount)}
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Видалити товар">
          <IconButton
            aria-label={`Видалити товар ${line.productId}`}
            onClick={onRemove}
            size="small"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
