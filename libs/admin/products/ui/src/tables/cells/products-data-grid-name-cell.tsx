import { Typography } from '@mui/material';

import type { AdminProductListItem } from '@admin/products/model';
import type { GridRenderCellParams } from '@mui/x-data-grid';

export function ProductsDataGridNameCell({ row }: GridRenderCellParams<AdminProductListItem>) {
  return (
    <Typography sx={{ overflowWrap: 'anywhere', py: 1, whiteSpace: 'normal', width: '100%' }} variant="body2">
      {row.nameUk}
    </Typography>
  );
}
