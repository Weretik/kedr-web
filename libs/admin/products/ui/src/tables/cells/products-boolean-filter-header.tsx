import { Box, MenuItem, Select, Typography } from '@mui/material';

export type ProductBooleanField = 'inStock' | 'hasStock' | 'isSale' | 'isNew';

const optionLabels: Partial<Record<ProductBooleanField, { yes: string; no: string }>> = {
  hasStock: { yes: 'Є', no: 'Немає' },
};

interface ProductsBooleanFilterHeaderProps {
  field: ProductBooleanField;
  label: string;
  value?: boolean;
  onChange: (field: ProductBooleanField, value: boolean | undefined) => void;
}

export function ProductsBooleanFilterHeader({
  field,
  label,
  value,
  onChange,
}: ProductsBooleanFilterHeaderProps) {
  const labels = optionLabels[field] ?? { yes: 'Так', no: 'Ні' };
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        width: '100%',
      }}
    >
      <Typography variant="caption">{label}</Typography>
      <Select
        displayEmpty
        inputProps={{ 'aria-label': `Фільтр ${label}` }}
        onChange={(event) =>
          onChange(field, event.target.value === '' ? undefined : event.target.value === 'true')
        }
        onClick={(event) => event.stopPropagation()}
        size="small"
        sx={{ fontSize: '0.75rem', height: 28, width: '100%' }}
        value={value === undefined ? '' : String(value)}
      >
        <MenuItem value="">Усі</MenuItem>
        <MenuItem value="true">{labels.yes}</MenuItem>
        <MenuItem value="false">{labels.no}</MenuItem>
      </Select>
    </Box>
  );
}
