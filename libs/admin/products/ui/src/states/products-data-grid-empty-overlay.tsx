import { Typography } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid';

export function ProductsDataGridEmptyOverlay({ message = 'Товарів немає.' }: { message?: string }) {
  return (
    <GridOverlay>
      <Typography color="text.secondary">{message}</Typography>
    </GridOverlay>
  );
}
