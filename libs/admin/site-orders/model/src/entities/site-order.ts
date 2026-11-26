/** Telegram delivery of a site order as the server reports it. */
export type SiteOrderTelegramStatus = 'sent' | 'pending' | 'failed';

export interface SiteOrderListItem {
  orderId: string;
  placedAtUtc: string;
  firstName: string;
  phone: string;
  lineCount: number;
  total: number;
  telegramStatus: SiteOrderTelegramStatus;
  telegramLastError: string | null;
}

export interface SiteOrderLine {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

export interface SiteOrderDetail {
  orderId: string;
  placedAtUtc: string;
  firstName: string;
  phone: string;
  total: number;
  telegramStatus: SiteOrderTelegramStatus;
  telegramSentAtUtc: string | null;
  telegramLastAttemptAtUtc: string | null;
  telegramLastError: string | null;
  /** The buyer's note from the checkout; `null` when there is none. */
  comment: string | null;
  items: readonly SiteOrderLine[];
}

export interface SiteOrderPage {
  items: readonly SiteOrderListItem[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
