import { Box } from '@mui/material';

import type { GridRenderCellParams } from '@mui/x-data-grid';

export function ProductsDataGridPhotoCell({ value }: GridRenderCellParams) {
  return value ? <Box alt="" component="img" src={value} sx={{ height: 48, objectFit: 'contain', width: 48 }} /> : '—';
}
