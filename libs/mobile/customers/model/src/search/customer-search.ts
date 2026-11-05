import type { Customer } from '../entities/customer';

const quotes = /[«»"'“”„’`]/g;

/** Lowercase text without quotes and extra spaces, so «ТОВ «Будмаркет»» matches «буд». */
export function normalizeText(text: string): string {
  return text.toLocaleLowerCase('uk').replace(quotes, '').replace(/\s+/g, ' ').trim();
}

function digitsOf(text: string): string {
  return text.replace(/\D/g, '');
}

/**
 * Whether the customer fits what the manager typed: part of the name, of the 1C code, or (from three digits) of the
 * phone number in any format (R-003).
 */
export function matchesCustomer(customer: Customer, query: string): boolean {
  const text = normalizeText(query);
  if (text.length === 0) return true;

  if (normalizeText(customer.name).includes(text)) return true;
  if (customer.counterpartyId.toLocaleLowerCase('uk').includes(text)) return true;

  const digits = digitsOf(query);
  return digits.length >= 3 && customer.phone !== null && digitsOf(customer.phone).includes(digits);
}

/** Customers that fit the query; names that start with it come first, then the rest, each in A–Я order. */
export function searchCustomers(customers: readonly Customer[], query: string): Customer[] {
  const text = normalizeText(query);
  const found = customers.filter((customer) => matchesCustomer(customer, query));
  const startsWith = (customer: Customer) => normalizeText(customer.name).startsWith(text);
  return found.sort(
    (a, b) => Number(startsWith(b)) - Number(startsWith(a)) || compareNames(a.name, b.name),
  );
}

export function compareNames(a: string, b: string): number {
  return normalizeText(a).localeCompare(normalizeText(b), 'uk');
}

export interface CustomerSection {
  letter: string;
  data: Customer[];
}

/**
 * The A–Я list: sections by the first letter of the name without legal-form prefixes in quotes; names that do not
 * start with a letter go to «#» at the end.
 */
export function groupByLetter(customers: readonly Customer[]): CustomerSection[] {
  const sections = new Map<string, Customer[]>();
  for (const customer of [...customers].sort((a, b) => compareNames(a.name, b.name))) {
    const first = normalizeText(customer.name).charAt(0).toLocaleUpperCase('uk');
    const letter = /\p{L}/u.test(first) ? first : '#';
    sections.set(letter, [...(sections.get(letter) ?? []), customer]);
  }
  return [...sections.entries()]
    .sort(([a], [b]) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b, 'uk')))
    .map(([letter, data]) => ({ data, letter }));
}
