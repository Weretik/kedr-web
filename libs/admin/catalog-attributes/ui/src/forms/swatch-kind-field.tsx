import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';

import type { SwatchKind } from '@admin/catalog-attributes/model';

interface SwatchKindFieldProps {
  kind: SwatchKind;
  onChange: (kind: SwatchKind) => void;
}

/** Whether the site filter shows the value as text, a color, or a picture. */
export function SwatchKindField({ kind, onChange }: SwatchKindFieldProps) {
  return (
    <Box>
      <Typography component="p" sx={{ fontWeight: 600, mb: 0.5 }} variant="body2">
        Зразок у фільтрі
      </Typography>
      <RadioGroup onChange={(_event, next) => onChange(next as SwatchKind)} row value={kind}>
        <FormControlLabel control={<Radio />} label="Лише текст" value="none" />
        <FormControlLabel control={<Radio />} label="Колір" value="color" />
        <FormControlLabel control={<Radio />} label="Картинка" value="texture" />
      </RadioGroup>
    </Box>
  );
}
