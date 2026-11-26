import { DataGridMessageOverlay } from '@admin/shared/ui';
import { siteRedirectPageSizes } from '@admin/site-redirects/model';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { SiteRedirectsGridToolbar } from './site-redirects-grid-toolbar';
import { siteRedirectsGridColumns } from './site-redirects-grid.columns';

import type { SiteRedirectRowActions } from './site-redirects-grid.columns';
import type { SiteRedirect } from '@admin/site-redirects/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

export interface SiteRedirectsDataGridProps extends SiteRedirectRowActions {
  error: boolean;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  onSearchChange: (search: string | undefined) => void;
  page: number;
  pageSize: number;
  rowCount: number;
  rows: readonly SiteRedirect[];
  search?: string;
}

/** Server-paged list of redirects with search in the toolbar (spec content/013 R-04). */
export function SiteRedirectsDataGrid(props: SiteRedirectsDataGridProps) {
  const { error, loading, page, pageSize, search } = props;
  const empty = search ? 'Нічого не знайдено.' : 'Переадресацій ще немає.';

  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        autoHeight
        columns={siteRedirectsGridColumns({ onDelete: props.onDelete, onEdit: props.onEdit })}
        disableColumnFilter
        disableRowSelectionOnClick
        filterMode="server"
        filterModel={{ items: [], quickFilterValues: search ? [search] : [] }}
        loading={loading}
        onFilterModelChange={(model) => {
          const next =
            model.quickFilterValues?.map(String).join(' ').trim().slice(0, 200) || undefined;
          if (next !== search) props.onSearchChange(next);
        }}
        onPaginationModelChange={(model: GridPaginationModel) => {
          if (loading || (model.page + 1 === page && model.pageSize === pageSize)) return;
          if (model.pageSize !== pageSize) props.onPageSizeChange(model.pageSize);
          else props.onPageChange(model.page + 1);
        }}
        pageSizeOptions={siteRedirectPageSizes}
        pagination
        paginationMode="server"
        paginationModel={{ page: page - 1, pageSize }}
        rowCount={props.rowCount}
        rows={error ? [] : [...props.rows]}
        showToolbar
        slots={{
          noRowsOverlay: error
            ? () => (
                <DataGridMessageOverlay
                  message="Не вдалося завантажити переадресації."
                  onRetry={props.onRetry}
                />
              )
            : () => <DataGridMessageOverlay message={empty} />,
          toolbar: SiteRedirectsGridToolbar,
        }}
      />
    </Box>
  );
}
