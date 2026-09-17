import type { OrderSyncStatus } from './order-sync-status';

export interface OrderSummary {
  counterpartyName: string;
  createdAtUtc: string;
  lineCount: number;
  orderId: number;
  orderNumber: string;
  syncStatus: OrderSyncStatus;
  totalAmount: number;
}

export interface OrderPage {
  items: OrderSummary[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
