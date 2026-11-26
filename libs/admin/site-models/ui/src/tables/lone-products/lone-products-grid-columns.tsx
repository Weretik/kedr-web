import AddOutlined from '@mui/icons-material/AddOutlined';
import { Button, Stack, Typography } from '@mui/material';

import { ProductThumb } from '../../components/display/product-thumb';

import type { SiteShowcaseItem } from '@admin/site-models/model';
import type { GridColDef } from '@mui/x-data-grid';
import type { ReactNode } from 'react';

export interface LoneProductsGridActions {
  /** The «Додати в модель» cell: a model picker the feature connects to the server. */
  renderAddToModel: (product: SiteShowcaseItem) => ReactNode;
  onNewModel: (product: SiteShowcaseItem) => void;
}

const fixed = { sortable: false, filterable: false, disableColumnMenu: true } as const;

/** Columns of «Товари без моделі» (spec 001 R-008). */
export function loneProductsGridColumns({
  onNewModel,
  renderAddToModel,
}: LoneProductsGridActions): GridColDef<SiteShowcaseItem>[] {
  return [
    {
      ...fixed,
      field: 'photo',
      headerName: 'Фото',
      width: 76,
      renderCell: ({ row }) => <ProductThumb src={row.photo} />,
    },
    {
      ...fixed,
      field: 'name',
      headerName: 'Товар',
      flex: 1.2,
      minWidth: 220,
      renderCell: ({ row }) => (
        <Stack sx={{ py: 1, whiteSpace: 'normal' }}>
          <Typography variant="body2">{row.name}</Typography>
          <Typography color="text.secondary" variant="caption">
            Код 1С: {row.productId}
          </Typography>
        </Stack>
      ),
    },
    { ...fixed, field: 'categoryName', headerName: 'Категорія в 1С', flex: 0.8, minWidth: 160 },
    {
      ...fixed,
      field: 'model',
      headerName: 'Додати в модель',
      flex: 1.4,
      minWidth: 320,
      renderCell: ({ row }) => renderAddToModel(row),
    },
    {
      ...fixed,
      field: 'actions',
      headerName: 'Дії',
      width: 168,
      renderCell: ({ row }) => (
        <Button onClick={() => onNewModel(row)} size="small" startIcon={<AddOutlined />}>
          Нова модель
        </Button>
      ),
    },
  ];
}
