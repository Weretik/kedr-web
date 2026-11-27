import { Stack } from '@mui/material';

import { OrderListActionsCell } from './order-list-actions-cell';
import { OrderStatusChip } from '../../components/order-status-chip';
import { OrderSyncNote } from '../../components/order-sync-note';
import { PriceAdjustmentText } from '../../components/price-adjustment-text';
import { SiteOrderLink } from '../../components/site-order-link';

import type { OrderListActions } from './order-list-actions-cell';
import type { DraftSummary, OrderSummary } from '@admin/orders/model';
import type { GridColDef } from '@mui/x-data-grid';

const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });
const moneyFormat = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });

/** Columns of the orders or drafts list, with the row actions last. */
export function orderListColumns(
  mode: 'orders' | 'drafts',
  hideCustomerColumn: boolean,
  actions: OrderListActions,
): GridColDef[] {
  const orders = mode === 'orders';
  const columns: GridColDef[] = orders
    ? [
        { field: 'orderNumber', headerName: 'Номер', minWidth: 150, flex: 1 },
        ...(!hideCustomerColumn
          ? [
              {
                field: 'counterpartyName',
                headerName: 'Клієнт',
                minWidth: 180,
                flex: 1,
              } satisfies GridColDef,
            ]
          : []),
        {
          field: 'createdAtUtc',
          headerName: 'Створено',
          minWidth: 180,
          flex: 1,
          valueFormatter: (value: string) => dateFormat.format(new Date(value)),
        },
        {
          field: 'totalAmount',
          headerName: 'Сума',
          minWidth: 130,
          flex: 0.7,
          valueFormatter: (value: number) => moneyFormat.format(value),
        },
        {
          field: 'adjustmentAmount',
          headerName: 'Знижка/Націнка',
          minWidth: 140,
          flex: 0.7,
          sortable: false,
          renderCell: ({ value }) => <PriceAdjustmentText value={Number(value ?? 0)} />,
        },
        ...siteOrderColumn(actions.onOpenSiteOrder),
        {
          field: 'syncStatus',
          headerName: '1C',
          minWidth: 200,
          flex: 1.2,
          sortable: false,
          renderCell: ({ row }) => (
            <Stack spacing={0.25} sx={{ alignItems: 'flex-start', minWidth: 0, py: 1 }}>
              <OrderStatusChip status={(row as OrderSummary).syncStatus} />
              <OrderSyncNote sync={row as OrderSummary} />
            </Stack>
          ),
        },
      ]
    : [
        { field: 'title', headerName: 'Назва', minWidth: 180, flex: 1 },
        { field: 'counterpartyName', headerName: 'Клієнт', minWidth: 180, flex: 1 },
        {
          field: 'updatedAtUtc',
          headerName: 'Оновлено',
          minWidth: 180,
          flex: 1,
          valueFormatter: (value: string) => dateFormat.format(new Date(value)),
        },
        { field: 'lineCount', headerName: 'Позицій', minWidth: 110, flex: 0.5, sortable: false },
      ];
  columns.push({
    field: 'actions',
    headerName: 'Дії',
    minWidth: orders ? 76 : 144,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => (
      <OrderListActionsCell
        actions={actions}
        orders={orders}
        row={row as OrderSummary | DraftSummary}
      />
    ),
  });
  return columns;
}

/** «З сайту»: the site order an order was made from (KedrStore spec sales/009, R-015); empty for a manager's order. */
function siteOrderColumn(onOpen: OrderListActions['onOpenSiteOrder']): GridColDef[] {
  if (!onOpen) return [];
  return [
    {
      field: 'siteOrderNumber',
      headerName: 'З сайту',
      minWidth: 130,
      flex: 0.6,
      sortable: false,
      renderCell: ({ row }) => {
        const { siteOrderId, siteOrderNumber } = row as OrderSummary;
        return siteOrderId && siteOrderNumber ? (
          <SiteOrderLink
            onOpen={onOpen}
            siteOrderId={siteOrderId}
            siteOrderNumber={siteOrderNumber}
          />
        ) : null;
      },
    },
  ];
}
