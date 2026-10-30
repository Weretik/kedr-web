import { OrderListActionsCell } from './order-list-actions-cell';
import { OrderStatusChip } from '../components/order-status-chip';
import { PriceAdjustmentText } from '../components/price-adjustment-text';

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
        {
          field: 'syncStatus',
          headerName: '1C',
          minWidth: 170,
          flex: 0.8,
          sortable: false,
          renderCell: ({ value }) => <OrderStatusChip status={String(value ?? '')} />,
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
