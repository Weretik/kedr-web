import { RowEditAction } from '@admin/shared/ui';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';

import type { SiteRedirect } from '@admin/site-redirects/model';
import type { GridColDef } from '@mui/x-data-grid';

const fixed = { sortable: false, filterable: false, disableColumnMenu: true } as const;

const dateTime = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

export interface SiteRedirectRowActions {
  onEdit: (redirect: SiteRedirect) => void;
  onDelete: (redirect: SiteRedirect) => void;
}

/** The server orders rows by the latest change, so no column sorts. */
export function siteRedirectsGridColumns(
  actions: SiteRedirectRowActions,
): GridColDef<SiteRedirect>[] {
  return [
    { ...fixed, field: 'from', headerName: 'Стара адреса', flex: 1, minWidth: 220 },
    { ...fixed, field: 'to', headerName: 'Нова адреса', flex: 1, minWidth: 220 },
    {
      ...fixed,
      field: 'updatedAt',
      headerName: 'Змінено',
      minWidth: 200,
      valueGetter: (_value, row) => `${dateTime.format(new Date(row.updatedAt))}, ${row.updatedBy}`,
    },
    {
      ...fixed,
      align: 'center',
      field: 'actions',
      headerAlign: 'center',
      headerName: 'Дії',
      width: 110,
      renderCell: ({ row }) => (
        <Stack
          direction="row"
          sx={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}
        >
          <RowEditAction
            label={`Редагувати переадресацію ${row.from}`}
            onEdit={() => actions.onEdit(row)}
            title="Редагувати"
          />
          <Tooltip title="Видалити">
            <IconButton
              aria-label={`Видалити переадресацію ${row.from}`}
              onClick={(event) => {
                event.stopPropagation();
                actions.onDelete(row);
              }}
              size="small"
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
}
