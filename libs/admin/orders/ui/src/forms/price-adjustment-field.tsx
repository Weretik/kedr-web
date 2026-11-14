import { maxPriceAdjustment, parsePriceAdjustment, priceAdjustmentTone } from '@admin/orders/model';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  productId: string;
  value: number;
  /** A problem with the resulting price, shown under the field like a typing error. */
  issue?: string | null;
  onChange: (value: number) => void;
}

const toText = (value: number) =>
  value ? `${value > 0 ? '+' : ''}${value}`.replace('.', ',') : '';

/**
 * "Знижка/Націнка" per unit in UAH: a minus sign makes a discount (red), a plus or a bare number a
 * markup (green). Keeps what the manager types until it is a valid amount.
 */
export function PriceAdjustmentField({ productId, value, issue, onChange }: Props) {
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
  const message = error || issue || '';
  const toneColor =
    tone === 'discount' ? 'error.main' : tone === 'markup' ? 'success.main' : undefined;
  return (
    <TextField
      error={Boolean(message)}
      helperText={message || undefined}
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
        // The border follows the sign too, so a discount never looks "fine" in green on focus.
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          toneColor ? { borderColor: message ? 'error.main' : toneColor } : {},
        '& .MuiInputBase-input': {
          color: toneColor,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: tone === 'none' ? undefined : 600,
        },
      }}
      value={text}
    />
  );
}
