import { Typography } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid';

export function ProductsDataGridEmptyOverlay() {
  return (
    <GridOverlay>
      <Typography color="text.secondary">Товарів за заданими умовами немає.</Typography>
    </GridOverlay>
  );
}
