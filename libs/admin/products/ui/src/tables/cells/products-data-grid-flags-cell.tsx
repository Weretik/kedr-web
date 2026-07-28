import { Chip, Stack } from '@mui/material';

import type { AdminProductListItem } from '@admin/products/model';
import type { GridRenderCellParams } from '@mui/x-data-grid';

export function ProductsDataGridFlagsCell({ row }: GridRenderCellParams<AdminProductListItem>) {
  return (
    <Stack direction="row" spacing={0.5}>
      {row.isSale ? <Chip color="warning" label="Акція" size="small" /> : null}
      {row.isNew ? <Chip color="info" label="Новинка" size="small" /> : null}
      {!row.isSale && !row.isNew ? '—' : null}
    </Stack>
  );
}
