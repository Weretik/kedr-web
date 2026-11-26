import { isProductsRow } from '@admin/site-models/model';

import { SiteModelActionsCell } from './site-model-actions-cell';
import { SiteModelCategoryCell } from './site-model-category-cell';
import { SiteModelNameCell } from './site-model-name-cell';
import { ProductThumb } from '../../components/display/product-thumb';
import { SiteProblemPills } from '../../components/display/site-problem-pills';
import { SiteModelExpandCell } from '../models-expand/site-model-expand-cell';

import type { SiteModelListItem, SiteModelsGridRow } from '@admin/site-models/model';
import type { GridColDef } from '@mui/x-data-grid';
import type { ReactNode } from 'react';

export interface SiteModelsGridActions {
  onView: (model: SiteModelListItem) => void;
  onEdit?: (model: SiteModelListItem) => void;
}

/** The arrow of each row and what an opened model shows under it (spec 001 R-002a). */
export interface SiteModelsGridExpansion {
  openIds?: ReadonlySet<number>;
  onToggleOpen?: (modelId: number) => void;
  renderProducts?: (modelId: number) => ReactNode;
}

const fixed = { sortable: false, filterable: false, disableColumnMenu: true } as const;

/** A model cell; the products row under an opened model spans the first column over the whole width. */
const modelCell =
  (render: (model: SiteModelListItem) => ReactNode) =>
  ({ row }: { row: SiteModelsGridRow }) =>
    isProductsRow(row) ? null : render(row);

/** Columns of «Моделі» (spec 001 R-002); no checkbox column, the server pages and filters. */
export function siteModelsGridColumns({
  onEdit,
  onToggleOpen,
  onView,
  openIds,
  renderProducts,
}: SiteModelsGridActions & SiteModelsGridExpansion): GridColDef<SiteModelsGridRow>[] {
  const columns: GridColDef<SiteModelsGridRow>[] = [
    {
      ...fixed,
      field: 'photo',
      headerName: 'Фото',
      width: 76,
      renderCell: modelCell((model) => <ProductThumb src={model.photo} />),
    },
    {
      ...fixed,
      field: 'name',
      headerName: 'Модель',
      flex: 1.4,
      minWidth: 220,
      renderCell: modelCell((model) => <SiteModelNameCell model={model} />),
    },
    {
      ...fixed,
      field: 'categoryName',
      headerName: 'Категорія на сайті',
      flex: 1,
      minWidth: 200,
      renderCell: modelCell((model) => <SiteModelCategoryCell model={model} />),
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
      valueGetter: (_value, row) =>
        isProductsRow(row) ? '' : row.axes.length > 0 ? row.axes.join(', ') : '—',
    },
    {
      ...fixed,
      field: 'problems',
      headerName: 'Чого бракує',
      flex: 1,
      minWidth: 200,
      renderCell: modelCell((model) => <SiteProblemPills problems={model.problems} />),
    },
    {
      ...fixed,
      field: 'actions',
      headerName: 'Дії',
      width: 104,
      renderCell: modelCell((model) => (
        <SiteModelActionsCell model={model} onEdit={onEdit} onView={onView} />
      )),
    },
  ];
  if (!onToggleOpen) return columns;

  const expand: GridColDef<SiteModelsGridRow> = {
    ...fixed,
    field: 'open',
    headerName: '',
    width: 52,
    colSpan: (_value, row) => (isProductsRow(row) ? columns.length + 1 : 1),
    renderCell: ({ row }) =>
      isProductsRow(row) ? (
        renderProducts?.(row.productsOf)
      ) : (
        <SiteModelExpandCell
          name={row.name}
          onToggle={() => onToggleOpen(row.id)}
          open={openIds?.has(row.id) ?? false}
        />
      ),
  };
  return [expand, ...columns];
}
