export interface Customer {
  counterpartyId: string;
  name: string;
  phone: string | null;
}

export function filterCustomersByName(customers: readonly Customer[], query: string): Customer[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [...customers];

  return customers.filter((customer) => normalize(customer.name).includes(normalizedQuery));
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('uk-UA');
}
