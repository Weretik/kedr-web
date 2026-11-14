import type { CustomerListItem } from '@admin/clients/model';

const sameCustomer = (left: CustomerListItem, right: CustomerListItem) =>
  left.counterpartyId === right.counterpartyId &&
  left.name === right.name &&
  left.phone === right.phone;

/** Adds one loaded page to the list; returns the same array when nothing changed. */
export function mergeCustomerPage(
  loaded: readonly CustomerListItem[],
  page: readonly CustomerListItem[],
): readonly CustomerListItem[] {
  const byId = new Map(loaded.map((customer) => [customer.counterpartyId, customer]));
  for (const customer of page) byId.set(customer.counterpartyId, customer);
  const merged = [...byId.values()];
  const unchanged =
    merged.length === loaded.length &&
    merged.every((customer, index) => sameCustomer(loaded[index], customer));
  return unchanged ? loaded : merged;
}

/** Keeps the chosen customer visible even before its page is loaded. */
export function withSelectedCustomer(
  loaded: readonly CustomerListItem[],
  chosen: CustomerListItem | undefined,
): CustomerListItem[] {
  const list = [...loaded];
  if (chosen && !list.some((customer) => customer.counterpartyId === chosen.counterpartyId)) {
    list.unshift(chosen);
  }
  return list;
}
