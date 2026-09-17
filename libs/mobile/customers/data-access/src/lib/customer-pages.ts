import type { CustomerPage } from '../contracts/customer-page.contract';
import type { Customer } from '@mobile/customers/model';

export type CustomerPageFetcher = (page: number, pageSize: number) => Promise<CustomerPage>;

export async function loadAllCustomers(fetchPage: CustomerPageFetcher): Promise<Customer[]> {
  const first = await fetchPage(1, 100);
  const customers = new Map(first.customers.map((customer) => [customer.counterpartyId, customer]));

  for (let page = 2; page <= first.totalPages; page += 1) {
    const next = await fetchPage(page, 100);
    for (const customer of next.customers) {
      if (!customers.has(customer.counterpartyId)) customers.set(customer.counterpartyId, customer);
    }
  }

  return [...customers.values()];
}
