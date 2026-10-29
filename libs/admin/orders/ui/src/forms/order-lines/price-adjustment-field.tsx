import { maxPriceAdjustment, parsePriceAdjustment, priceAdjustmentTone } from '@admin/orders/model';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  productId: string;
  value: number;
  onChange: (value: number) => void;
}

const toText = (value: number) =>
  value ? `${value > 0 ? '+' : ''}${value}`.replace('.', ',') : '';

/**
 * "Знижка/Націнка" per unit in UAH: a minus sign makes a discount (red), a plus or a bare number a
 * markup (green). Keeps what the manager types until it is a valid amount.
 */
export function PriceAdjustmentField({ productId, value, onChange }: Props) {
  const [text, setText] = useState(() => toText(value));
  const [error, setError] = useState('');
  useEffect(() => {
    // Follow outside changes (another tab, a reload) without fighting the manager's typing.
    setText((current) => {
      const parsed = parsePriceAdjustment(current);
      return 'value' in parsed && parsed.value === value ? current : toText(value);
    });
  }, [value]);
  const tone = priceAdjustmentTone(value);
  return (
    <TextField
      error={Boolean(error)}
      helperText={error || undefined}
      onBlur={() => {
        if (!error) setText(toText(value));
      }}
      onChange={(event) => {
        const next = event.target.value;
        setText(next);
        const parsed = parsePriceAdjustment(next);
        if ('error' in parsed) {
          setError(parsed.error);
          return;
        }
        setError('');
        if (parsed.value !== value) onChange(parsed.value);
      }}
      placeholder="0"
      size="small"
      slotProps={{
        htmlInput: {
          'aria-label': `Знижка або націнка за штуку, товар ${productId}`,
          inputMode: 'decimal',
          maxLength: String(maxPriceAdjustment).length + 4,
          style: { textAlign: 'right' },
        },
      }}
      sx={{
        width: 116,
        '& .MuiInputBase-input': {
          color:
            tone === 'discount' ? 'error.main' : tone === 'markup' ? 'success.main' : undefined,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: tone === 'none' ? undefined : 600,
        },
      }}
      value={text}
    />
  );
}
