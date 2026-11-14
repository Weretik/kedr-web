import { isSwatchHex } from '@admin/catalog-attributes/model';
import { Box, Stack, TextField } from '@mui/material';

interface ColorSwatchFieldProps {
  hex: string;
  hexValid: boolean;
  onChange: (hex: string) => void;
}

/** A #RRGGBB color picked in the color dialog or typed by hand. */
export function ColorSwatchField({ hex, hexValid, onChange }: ColorSwatchFieldProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box
        aria-label="Вибрати колір"
        component="input"
        onChange={(event) => onChange(event.target.value.toUpperCase())}
        sx={{ border: 0, height: 44, p: 0, width: 56, bgcolor: 'transparent' }}
        type="color"
        value={isSwatchHex(hex) && hex !== '' ? hex : '#000000'}
      />
      <TextField
        error={!hexValid}
        helperText={hexValid ? undefined : 'Формат #RRGGBB, наприклад #B08D57.'}
        label="Колір"
        onChange={(event) => onChange(event.target.value.trim())}
        value={hex}
      />
    </Stack>
  );
}
