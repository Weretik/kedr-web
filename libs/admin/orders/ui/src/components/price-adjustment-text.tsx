import { formatPriceAdjustment, priceAdjustmentTone } from '@admin/orders/model';
import { Box } from '@mui/material';

interface Props {
  value: number | undefined;
  /** Prefix with "Знижка" or "Націнка", for totals. */
  label?: boolean;
}

/** A discount in red with a minus sign, a markup in green with a plus sign, nothing as "—". */
export function PriceAdjustmentText({ value, label = false }: Props) {
  const rounded = Math.round((value ?? 0) * 100) / 100;
  const tone = priceAdjustmentTone(rounded);
  return (
    <Box
      component="span"
      sx={{
        color: tone === 'discount' ? 'error.main' : tone === 'markup' ? 'success.main' : undefined,
        fontVariantNumeric: 'tabular-nums',
        fontWeight: tone === 'none' ? undefined : 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label && tone !== 'none' ? `${tone === 'discount' ? 'Знижка' : 'Націнка'}: ` : ''}
      {formatPriceAdjustment(rounded)}
    </Box>
  );
}
