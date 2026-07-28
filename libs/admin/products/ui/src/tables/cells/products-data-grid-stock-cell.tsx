import { Chip } from '@mui/material';

import type { GridRenderCellParams } from '@mui/x-data-grid';

export function ProductsDataGridStockCell({ value }: GridRenderCellParams) {
  return <Chip color={value ? 'success' : 'default'} label={value ? 'В наявності' : 'Немає'} size="small" />;
}
