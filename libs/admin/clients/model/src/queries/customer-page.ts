import type { CustomerListItem } from '../entities/customer';

export interface CustomerPage {
  items: readonly CustomerListItem[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export interface CustomerPageQuery {
  page: number;
  pageSize: number;
  searchTerm?: string;
  counterpartyId?: string;
  name?: string;
  phone?: string;
  sort?: CustomerSort;
}

export type CustomerSort =
  'name' | '-name' | 'counterpartyId' | '-counterpartyId' | 'phone' | '-phone';
