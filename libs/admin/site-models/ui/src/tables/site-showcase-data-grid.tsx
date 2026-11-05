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

function ValueLines({ item }: { item: SiteShowcaseItem }) {
  if (item.values.length === 0) return muted('—');
  return (
    <Stack spacing={0.25} sx={{ py: 1.25 }}>
      {item.values.map((value) => (
        <Typography key={`${value.attributeId}-${value.value}`} variant="body2">
          <Box component="span" sx={{ color: 'text.secondary' }}>
            {value.attributeName}:
          </Box>{' '}
          {value.value}
        </Typography>
      ))}
    </Stack>
  );
}

/** The product of a row without a model, or `undefined` for a model row. */
const loneProduct = (row: SiteShowcaseRow) => (row.model ? undefined : row.products[0]);

function columns(props: SiteShowcaseDataGridProps): GridColDef<GridRow>[] {
  return [
    {
      field: 'expand',
      headerName: '',
      width: 56,
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
      width: 76,
      sortable: false,
      renderCell: ({ row }) =>
        row.kind === 'model' ? (
          <ProductThumb src={row.row.photo} />
        ) : (
          <Box sx={{ pl: 1.5 }}>
            <ProductThumb size={36} src={row.item.photo} />
          </Box>
        ),
    },
    {
      field: 'name',
      headerName: 'Модель / товар',
      flex: 1.8,
      minWidth: 260,
      sortable: false,
      renderCell: ({ row }) => {
        if (row.kind === 'product') {
          return (
            <Stack spacing={0.25} sx={{ pl: 2, py: 1 }}>
              <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
                {row.item.name}
              </Typography>
              <Typography color="text.secondary" variant="caption">
                Код 1С {row.item.productId}
              </Typography>
            </Stack>
          );
        }
        const lone = loneProduct(row.row);
        return (
          <Stack spacing={0.5} sx={{ alignItems: 'flex-start', py: 1.25 }}>
            <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
              {row.row.name}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {lone
                ? `Код 1С ${lone.productId} · без моделі`
                : `Товарів: ${row.row.products.length}`}{' '}
              · {row.row.categoryName}
            </Typography>
            {row.row.model?.status === 'proposed' ? (
              <StatusPill label="Запропонована" tone="info" />
            ) : null}
          </Stack>
        );
      },
    },
    {
      field: 'values',
      headerName: 'Ознаки',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) => {
        const item = row.kind === 'product' ? row.item : loneProduct(row.row);
        return item ? <ValueLines item={item} /> : null;
      },
    },
    {
      field: 'price',
      headerName: 'Ціна',
      minWidth: 120,
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
      minWidth: 90,
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
      flex: 1.2,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ py: 1.25 }}>
          <SiteProblemPills
            problems={row.kind === 'product' ? row.item.problems : row.row.problems}
          />
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Дії',
      width: 110,
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

/** «Вітрина сайту»: models with their on-site products; the arrow or a click on the row shows the products. */
export function SiteShowcaseDataGrid(props: SiteShowcaseDataGridProps) {
  return (
    <Box sx={{ minWidth: 0, overflowX: 'auto', width: '100%' }}>
      <Box sx={{ minWidth: 960 }}>
        <DataGrid
          autoHeight
          columns={columns(props)}
          disableColumnMenu
          disableRowSelectionOnClick
          getRowClassName={({ row }) => (row.kind === 'product' ? 'showcase-product' : '')}
          getRowHeight={() => 'auto'}
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
    </Box>
  );
}
