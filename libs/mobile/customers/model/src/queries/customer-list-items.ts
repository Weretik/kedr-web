import { groupByLetter } from './customer-search';

import type { Customer } from '../entities/customer';

export interface CustomerListSection {
  key: string;
  title: string;
  data: Customer[];
}

/** FlashList has no sections: headers and customers go in one list, told apart by `kind`. */
export type CustomerListItem =
  | { kind: 'header'; key: string; title: string }
  | { customer: Customer; key: string; kind: 'customer' };

/** The A–Я sections; they change only after a sync. */
export const letterSections = (customers: readonly Customer[]): CustomerListSection[] =>
  groupByLetter(customers).map((section) => ({
    data: section.data,
    key: `letter-${section.letter}`,
    title: section.letter,
  }));

/** The recently picked customers the device still knows, most recent first. */
export function recentCustomers(
  customers: readonly Customer[],
  recentIds: readonly string[],
): Customer[] {
  const byId = new Map(customers.map((customer) => [customer.counterpartyId, customer]));
  return recentIds
    .map((id) => byId.get(id))
    .filter((customer): customer is Customer => customer !== undefined);
}

/** Search results alone, or «Недавні» before the A–Я list (R-003). */
export function customerListSections(
  found: Customer[] | null,
  recent: Customer[],
  letters: CustomerListSection[],
): CustomerListSection[] {
  if (found) return found.length > 0 ? [{ data: found, key: 'found', title: 'Знайдено' }] : [];
  return recent.length > 0
    ? [{ data: recent, key: 'recent', title: 'Недавні' }, ...letters]
    : letters;
}

export function flattenSections(sections: readonly CustomerListSection[]): CustomerListItem[] {
  const items: CustomerListItem[] = [];
  for (const section of sections) {
    items.push({ key: section.key, kind: 'header', title: section.title });
    for (const customer of section.data) {
      items.push({ customer, key: `${section.key}:${customer.counterpartyId}`, kind: 'customer' });
    }
  }
  return items;
}
