import { Stack, Typography } from '@mui/material';

import type { AdminProductListItem } from '@admin/products/model';
import type { GridRenderCellParams } from '@mui/x-data-grid';

export function ProductsDataGridNameCell({ row }: GridRenderCellParams<AdminProductListItem>) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 0, py: 1 }}>
      <Typography noWrap variant="body2">
        {row.nameUk}
      </Typography>
      <Typography color="text.secondary" noWrap variant="caption">
        {row.nameRu}
      </Typography>
    </Stack>
  );
}
