import { DataGridMessageOverlay } from '@admin/shared/ui';
import { siteModelsGridRows, siteModelsPageSizes } from '@admin/site-models/model';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { siteModelsGridColumns } from './site-models-grid-columns';
import { SiteModelsGridToolbar } from '../models-toolbar/site-models-grid-toolbar';
import { SiteModelsToolbarContext } from '../models-toolbar/site-models-toolbar-context';

import type { SiteModelsGridActions, SiteModelsGridExpansion } from './site-models-grid-columns';
import type { SiteModelsToolbarValue } from '../models-toolbar/site-models-toolbar-context';
import type { SiteModelListItem } from '@admin/site-models/model';

export interface SiteModelsDataGridProps extends SiteModelsGridActions, SiteModelsGridExpansion {
  rows: readonly SiteModelListItem[];
  rowCount: number;
  loading: boolean;
  /** One-based page. */
  page: number;
  pageSize: number;
  search: string;
  filters: SiteModelsToolbarValue;
  emptyMessage: string;
  errorMessage?: string;
  onRetry: () => void;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

/** «Моделі»: a server-paged Data Grid of models with the toolbar filters; an arrow opens a model's products (R-002, R-002a). */
export function SiteModelsDataGrid(props: SiteModelsDataGridProps) {
  const { onEdit, onToggleOpen, onView, openIds, renderProducts } = props;
  const columns = useMemo(
    () => siteModelsGridColumns({ onEdit, onToggleOpen, onView, openIds, renderProducts }),
    [onEdit, onToggleOpen, onView, openIds, renderProducts],
  );
  const rows = useMemo(
    () => siteModelsGridRows(props.rows, openIds ?? new Set<number>()),
    [props.rows, openIds],
  );
  const noRowsOverlay = props.errorMessage
    ? () => <DataGridMessageOverlay message={props.errorMessage ?? ''} onRetry={props.onRetry} />
    : () => <DataGridMessageOverlay message={props.emptyMessage} />;

  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <SiteModelsToolbarContext.Provider value={props.filters}>
        <DataGrid
          autoHeight
          columns={columns}
          disableColumnFilter
          disableColumnSorting
          disableRowSelectionOnClick
          filterMode="server"
          filterModel={{ items: [], quickFilterValues: props.search ? [props.search] : [] }}
          getEstimatedRowHeight={() => 72}
          getRowHeight={() => 'auto'}
          loading={props.loading}
          onFilterModelChange={(model) =>
            props.onSearchChange((model.quickFilterValues ?? []).join(' '))
          }
          onPaginationModelChange={(model) => {
            if (model.pageSize !== props.pageSize) props.onPageSizeChange(model.pageSize);
            else props.onPageChange(model.page + 1);
          }}
          pageSizeOptions={[...siteModelsPageSizes]}
          pagination
          paginationMode="server"
          paginationModel={{ page: props.page - 1, pageSize: props.pageSize }}
          rowCount={props.errorMessage ? 0 : props.rowCount}
          rows={props.errorMessage ? [] : rows}
          showToolbar
          slots={{ noRowsOverlay, toolbar: SiteModelsGridToolbar }}
        />
      </SiteModelsToolbarContext.Provider>
    </Box>
  );
}
