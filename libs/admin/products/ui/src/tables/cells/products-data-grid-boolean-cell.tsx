import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { Box } from '@mui/material';

import type { AdminProductListItem } from '@admin/products/model';
import type { GridRenderCellParams } from '@mui/x-data-grid';

export function ProductsDataGridBooleanCell({ value }: GridRenderCellParams<AdminProductListItem, boolean>) {
  return (
    <Box aria-label={value ? 'Так' : 'Ні'} component="span" role="img">
      {value ? <CheckOutlinedIcon aria-hidden="true" color="success" fontSize="small" /> : null}
    </Box>
  );
}
