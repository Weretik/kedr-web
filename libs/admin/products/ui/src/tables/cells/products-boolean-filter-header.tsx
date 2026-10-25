import { Box, MenuItem, Select, Typography } from '@mui/material';

export type ProductBooleanField = 'inStock' | 'isSale' | 'isNew';

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
        <MenuItem value="true">Так</MenuItem>
        <MenuItem value="false">Ні</MenuItem>
      </Select>
    </Box>
  );
}
