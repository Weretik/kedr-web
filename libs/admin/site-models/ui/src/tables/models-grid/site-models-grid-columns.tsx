import { SiteModelActionsCell } from './site-model-actions-cell';
import { SiteModelCategoryCell } from './site-model-category-cell';
import { SiteModelNameCell } from './site-model-name-cell';
import { ProductThumb } from '../../components/display/product-thumb';
import { SiteProblemPills } from '../../components/display/site-problem-pills';

import type { SiteModelListItem } from '@admin/site-models/model';
import type { GridColDef } from '@mui/x-data-grid';

export interface SiteModelsGridActions {
  onView: (model: SiteModelListItem) => void;
  onEdit?: (model: SiteModelListItem) => void;
}

const fixed = { sortable: false, filterable: false, disableColumnMenu: true } as const;

/** Columns of «Моделі» (spec 001 R-002); no checkbox column, the server pages and filters. */
export function siteModelsGridColumns({
  onEdit,
  onView,
}: SiteModelsGridActions): GridColDef<SiteModelListItem>[] {
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
      headerName: 'Модель',
      flex: 1.4,
      minWidth: 220,
      renderCell: ({ row }) => <SiteModelNameCell model={row} />,
    },
    {
      ...fixed,
      field: 'categoryName',
      headerName: 'Категорія на сайті',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => <SiteModelCategoryCell model={row} />,
    },
    {
      ...fixed,
      field: 'onSiteCount',
      headerName: 'Товарів',
      align: 'right',
      headerAlign: 'right',
      width: 96,
    },
    {
      ...fixed,
      field: 'axes',
      headerName: 'Перемикачі',
      flex: 0.8,
      minWidth: 150,
      valueGetter: (_value, row) => (row.axes.length > 0 ? row.axes.join(', ') : '—'),
    },
    {
      ...fixed,
      field: 'problems',
      headerName: 'Чого бракує',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => <SiteProblemPills problems={row.problems} />,
    },
    {
      ...fixed,
      field: 'actions',
      headerName: 'Дії',
      width: 104,
      renderCell: ({ row }) => <SiteModelActionsCell model={row} onEdit={onEdit} onView={onView} />,
    },
  ];
}
