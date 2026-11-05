import { DataGridMessageOverlay, RowEditAction, StatusPill } from '@admin/shared/ui';
import { formatSitePrice } from '@admin/site-models/model';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { ProductThumb } from '../common/product-thumb';
import { SiteProblemPills } from '../common/site-problem-pills';

import type { SiteShowcaseItem, SiteShowcaseRow } from '@admin/site-models/model';
import type { GridColDef } from '@mui/x-data-grid';

interface SiteShowcaseDataGridProps {
  rows: readonly SiteShowcaseRow[];
  rowCount: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: boolean;
  /** Keys of the model rows whose products are shown. */
  expanded: ReadonlySet<string>;
  onToggle: (key: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  onEdit: (item: SiteShowcaseItem) => void;
  onOpenModel: (modelId: number) => void;
}

/** A model row, or one of its products shown under it. */
type GridRow =
  | { id: string; kind: 'model'; row: SiteShowcaseRow }
  | { id: string; kind: 'product'; item: SiteShowcaseItem };

const muted = (text: string) => (
  <Typography color="text.secondary" variant="body2">
    {text}
  </Typography>
);

/** Attribute values in one line; the full list is in the hint. */
function ValueLine({ item }: { item: SiteShowcaseItem }) {
  if (item.values.length === 0) return muted('—');
  const text = item.values.map((value) => `${value.attributeName}: ${value.value}`).join(' · ');
  return (
    <Typography noWrap title={text} variant="body2">
      {text}
    </Typography>
  );
}

/** The product of a row without a model, or `undefined` for a model row. */
const loneProduct = (row: SiteShowcaseRow) => (row.model ? undefined : row.products[0]);

function columns(props: SiteShowcaseDataGridProps): GridColDef<GridRow>[] {
  return [
    {
      field: 'expand',
      headerName: '',
      width: 48,
      sortable: false,
      renderCell: ({ row }) =>
        row.kind === 'model' && row.row.model ? (
          <IconButton
            aria-expanded={props.expanded.has(row.row.key)}
            aria-label={`Товари моделі ${row.row.name}`}
            onClick={(event) => {
              event.stopPropagation();
              props.onToggle(row.row.key);
            }}
            size="small"
          >
            {props.expanded.has(row.row.key) ? (
              <KeyboardArrowDownIcon fontSize="small" />
            ) : (
              <KeyboardArrowRightIcon fontSize="small" />
            )}
          </IconButton>
        ) : null,
    },
    {
      field: 'photo',
      headerName: 'Фото',
      width: 64,
      sortable: false,
      renderCell: ({ row }) =>
        row.kind === 'model' ? (
          <ProductThumb src={row.row.photo} />
        ) : (
          <Box sx={{ pl: 1 }}>
            <ProductThumb size={32} src={row.item.photo} />
          </Box>
        ),
    },
    {
      field: 'name',
      headerName: 'Модель / товар',
      flex: 1.6,
      minWidth: 240,
      sortable: false,
      renderCell: ({ row }) => {
        if (row.kind === 'product') {
          return (
            <Stack sx={{ minWidth: 0, pl: 2 }}>
              <Typography noWrap title={row.item.name} variant="body2">
                {row.item.name}
              </Typography>
              <Typography color="text.secondary" noWrap variant="caption">
                Код 1С {row.item.productId}
              </Typography>
            </Stack>
          );
        }
        const lone = loneProduct(row.row);
        return (
          <Stack sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
              <Typography noWrap sx={{ fontWeight: 600 }} title={row.row.name} variant="body2">
                {row.row.name}
              </Typography>
              {row.row.model?.status === 'proposed' ? (
                <Box sx={{ flexShrink: 0 }}>
                  <StatusPill label="Запропонована" tone="info" />
                </Box>
              ) : null}
            </Stack>
            <Typography color="text.secondary" noWrap variant="caption">
              {lone
                ? `Код 1С ${lone.productId} · без моделі`
                : `Товарів: ${row.row.products.length}`}{' '}
              · {row.row.categoryName}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'values',
      headerName: 'Ознаки',
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: ({ row }) => {
        const item = row.kind === 'product' ? row.item : loneProduct(row.row);
        return item ? <ValueLine item={item} /> : null;
      },
    },
    {
      field: 'price',
      headerName: 'Ціна',
      width: 120,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) =>
        row.kind === 'product'
          ? formatSitePrice(row.item.retailPrice)
          : row.row.minPrice !== null && row.row.products.length > 1
            ? `від ${formatSitePrice(row.row.minPrice)}`
            : formatSitePrice(row.row.minPrice),
    },
    {
      field: 'inStock',
      headerName: 'Наявн.',
      width: 80,
      sortable: false,
      renderCell: ({ row }) =>
        (row.kind === 'product' ? row.item.inStock : row.row.inStock) ? (
          <Typography variant="body2">Є</Typography>
        ) : (
          muted('Немає')
        ),
    },
    {
      field: 'problems',
      headerName: 'Чого бракує',
      width: 190,
      sortable: false,
      renderCell: ({ row }) => (
        <SiteProblemPills
          compact
          problems={row.kind === 'product' ? row.item.problems : row.row.problems}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Дії',
      width: 100,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => {
        const item = row.kind === 'product' ? row.item : loneProduct(row.row);
        if (item) {
          return (
            <RowEditAction
              label={`Змінити ознаки товару ${item.name}`}
              onEdit={() => props.onEdit(item)}
              title="Змінити ознаки"
            />
          );
        }
        const model = row.kind === 'model' ? row.row.model : null;
        return model ? (
          <Button
            aria-label={`Відкрити модель ${model.name}`}
            onClick={(event) => {
              event.stopPropagation();
              props.onOpenModel(model.id);
            }}
            size="small"
          >
            Відкрити
          </Button>
        ) : null;
      },
    },
  ];
}

/** Fills the screen below the filters, but never shorter than ten rows. */
const SHOWCASE_GRID_HEIGHT = { xs: 560, md: 'max(480px, calc(100vh - 300px))' };

/** Model rows with their products below the expanded ones. */
export function showcaseGridRows(
  rows: readonly SiteShowcaseRow[],
  expanded: ReadonlySet<string>,
): GridRow[] {
  return rows.flatMap((row): GridRow[] => [
    { id: row.key, kind: 'model', row },
    ...(row.model && expanded.has(row.key)
      ? row.products.map((item): GridRow => ({
          id: `${row.key}-${item.productId}`,
          kind: 'product',
          item,
        }))
      : []),
  ]);
}

/**
 * «Вітрина сайту»: models with their on-site products; the arrow or a click on the row shows the products.
 * One-line rows; the grid keeps a bounded height and scrolls inside instead of stretching the page.
 */
export function SiteShowcaseDataGrid(props: SiteShowcaseDataGridProps) {
  return (
    <Box sx={{ height: SHOWCASE_GRID_HEIGHT, minWidth: 0, width: '100%' }}>
      <DataGrid
        columns={columns(props)}
        disableColumnMenu
        disableRowSelectionOnClick
        getRowClassName={({ row }) => (row.kind === 'product' ? 'showcase-product' : '')}
        getRowHeight={({ model }) => (model.kind === 'product' ? 48 : 60)}
        getRowId={(row) => row.id}
        loading={props.loading}
        onPaginationModelChange={(next) =>
          next.pageSize !== props.pageSize
            ? props.onPageSizeChange(next.pageSize)
            : props.onPageChange(next.page + 1)
        }
        onRowClick={({ row }) => {
          if (row.kind === 'model' && row.row.model) props.onToggle(row.row.key);
        }}
        pageSizeOptions={[25, 50, 100]}
        pagination
        paginationMode="server"
        paginationModel={{ page: props.page - 1, pageSize: props.pageSize }}
        rowCount={props.error ? 0 : props.rowCount}
        rows={props.error ? [] : showcaseGridRows(props.rows, props.expanded)}
        slots={{
          noRowsOverlay: () =>
            props.error ? (
              <DataGridMessageOverlay
                message="Не вдалося завантажити вітрину."
                onRetry={props.onRetry}
              />
            ) : (
              <DataGridMessageOverlay message="Моделей і товарів за цими умовами немає." />
            ),
        }}
        sx={{
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .showcase-product': { bgcolor: 'action.hover', cursor: 'default' },
        }}
      />
    </Box>
  );
}
