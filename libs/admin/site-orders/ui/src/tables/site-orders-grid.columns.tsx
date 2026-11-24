import { formatSiteOrderMoney, formatSiteOrderTime } from '@admin/site-orders/model';

import { SiteOrderGridViewCell } from './site-order-grid-view-cell';
import { SiteOrderTelegramCell } from './site-order-telegram-cell';

import type { SiteOrderListItem } from '@admin/site-orders/model';
import type { GridColDef } from '@mui/x-data-grid';

const fixed = { sortable: false, filterable: false, disableColumnMenu: true } as const;

/** Columns of spec R-002; the server orders the rows newest first, so no column sorts. */
export function siteOrdersGridColumns(
  onView: (orderId: string) => void,
): GridColDef<SiteOrderListItem>[] {
  return [
    {
      ...fixed,
      field: 'placedAtUtc',
      headerName: 'Дата',
      minWidth: 160,
      valueFormatter: (value: string) => formatSiteOrderTime(value),
    },
    { ...fixed, field: 'firstName', headerName: 'Ім’я', flex: 1, minWidth: 140 },
    { ...fixed, field: 'phone', headerName: 'Телефон', minWidth: 150 },
    {
      ...fixed,
      align: 'right',
      field: 'lineCount',
      headerAlign: 'right',
      headerName: 'Товарів',
      width: 100,
    },
    {
      ...fixed,
      align: 'right',
      field: 'total',
      headerAlign: 'right',
      headerName: 'Сума, грн',
      minWidth: 120,
      valueFormatter: (value: number) => formatSiteOrderMoney(value),
    },
    {
      ...fixed,
      field: 'telegramStatus',
      headerName: 'Telegram',
      minWidth: 150,
      renderCell: ({ row }) => <SiteOrderTelegramCell order={row} />,
    },
    {
      ...fixed,
      align: 'center',
      field: 'view',
      headerAlign: 'center',
      headerName: 'Дії',
      width: 80,
      renderCell: ({ row }) => (
        <SiteOrderGridViewCell name={row.firstName} onView={onView} orderId={row.orderId} />
      ),
    },
  ];
}
