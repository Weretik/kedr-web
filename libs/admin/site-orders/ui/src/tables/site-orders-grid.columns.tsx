import {
  formatSiteOrderMoney,
  formatSiteOrderTime,
  siteOrderNumber,
} from '@admin/site-orders/model';

import { SiteOrderGridViewCell } from './site-order-grid-view-cell';
import { SiteOrderTelegramCell } from './site-order-telegram-cell';
import { SiteOrderOneCLink } from '../components/site-order-one-c-link';

import type { SiteOrderListItem } from '@admin/site-orders/model';
import type { GridColDef } from '@mui/x-data-grid';

const fixed = { sortable: false, filterable: false, disableColumnMenu: true } as const;

/** Columns of spec R-002; the server orders the rows newest first, so no column sorts. */
export function siteOrdersGridColumns(
  onView: (orderId: string) => void,
  onOpenOrder: (orderId: number) => void,
): GridColDef<SiteOrderListItem>[] {
  return [
    {
      ...fixed,
      field: 'orderId',
      headerName: 'Номер',
      minWidth: 120,
      valueFormatter: (value: string) => siteOrderNumber(value),
    },
    {
      ...fixed,
      field: 'placedAtUtc',
      headerName: 'Дата',
      minWidth: 160,
      valueFormatter: (value: string) => formatSiteOrderTime(value),
    },
    { ...fixed, field: 'firstName', headerName: 'Ім’я', flex: 0.5, minWidth: 110 },
    {
      ...fixed,
      field: 'phone',
      headerName: 'Телефон',
      flex: 0.5,
      minWidth: 180,
      // «+38 (050) 280-42-86» always stays on one line (owner request 2026-11-27).
      renderCell: ({ value }) => <span style={{ whiteSpace: 'nowrap' }}>{value as string}</span>,
    },
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
      field: 'oneCOrderNumber',
      headerName: 'Замовлення 1С',
      minWidth: 170,
      renderCell: ({ row }) => <SiteOrderOneCLink onOpenOrder={onOpenOrder} order={row} />,
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
