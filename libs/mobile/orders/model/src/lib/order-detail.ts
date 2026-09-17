import type { OrderSyncStatus } from './order-sync-status';

export interface OrderCounterparty {
  counterpartyId: string;
  name: string;
  phone: string | null;
}

export interface OrderDetailLine {
  amount: number;
  productId: string;
  productName: string;
  quantity: number;
}

export interface OrderDetail {
  acceptedAtUtc: string | null;
  comment: string | null;
  counterparty: OrderCounterparty;
  createdAtUtc: string;
  lines: OrderDetailLine[];
  oneCDocumentNumber: string | null;
  orderId: number;
  orderNumber: string;
  syncStatus: OrderSyncStatus;
  totalAmount: number;
}
