export interface OrderInputLine {
  productId: string;
  quantity: number;
}
export interface PricedLine extends OrderInputLine {
  productName: string | null;
  unitPrice: number | null;
  lineAmount: number | null;
}
export interface QuotedLine extends OrderInputLine {
  productName: string;
  unitPrice: number;
  lineAmount: number;
}
export interface OrderQuote {
  counterpartyId: string;
  lines: QuotedLine[];
  totalAmount: number;
  quoteFingerprint: string;
}
export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
export interface Page<T> {
  items: T[];
  pageInfo: PageInfo;
}
export interface OrderSummary {
  orderId: number;
  orderNumber: string;
  counterpartyId: string;
  counterpartyName: string;
  createdAtUtc: string;
  lineCount: number;
  totalAmount: number;
  syncStatus: string;
}
export interface DraftSummary {
  draftId: number;
  title: string;
  counterpartyId: string;
  counterpartyName: string;
  updatedAtUtc: string;
  lineCount: number;
}
export interface OrderRecord extends OrderSummary {
  comment: string | null;
  lines: Array<OrderInputLine & { productName: string; amount: number }>;
  oneCDocumentNumber: string | null;
}
export interface DraftRecord {
  draftId: number;
  version: string;
  title: string;
  note: string | null;
  counterpartyId: string;
  counterpartyName: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  lines: PricedLine[];
  totalAmount: number | null;
  pricingStatus: 'Available' | 'Unavailable';
  pricingErrorCode: string | null;
}
export interface DraftInput {
  title: string;
  note: string | null;
  counterpartyId: string;
  lines: OrderInputLine[];
}
export interface ListQuery {
  page: number;
  pageSize: number;
  searchTerm?: string;
  counterpartyId?: string;
  sort: string;
}
export interface CreatedOrder {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  syncStatus: string;
}
