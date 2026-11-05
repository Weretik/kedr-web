import {
  formatKopecks,
  groupByLetter,
  matchesCustomer,
  pushRecent,
  searchCustomers,
  type Customer,
} from './index';

const customer = (counterpartyId: string, name: string, phone: string | null = null): Customer => ({
  balanceKopecks: null,
  counterpartyId,
  debtKopecks: null,
  defaultPriceTypeId: 12,
  email: 'x@example.com',
  name,
  phone,
});

const budmarket = customer('000123', 'ТОВ «Будмаркет»', '+380 (50) 111-22-33');
const budservis = customer('000456', 'Будсервіс-Захід');
const alfa = customer('000789', 'Альфа');

describe('customer search (R-003, SC-004)', () => {
  it('finds both «буд» customers by part of the name, ignoring quotes and case', () => {
    expect(
      searchCustomers([alfa, budmarket, budservis], 'буд').map((c) => c.counterpartyId),
    ).toEqual(['000456', '000123']);
  });

  it('finds by code and by phone digits in any format', () => {
    expect(matchesCustomer(budmarket, '0001')).toBe(true);
    expect(matchesCustomer(budmarket, '050 111')).toBe(true);
    expect(matchesCustomer(budmarket, '22-33')).toBe(true);
    expect(matchesCustomer(alfa, '111')).toBe(false);
  });

  it('groups the A–Я list by first letter with «#» last', () => {
    const sections = groupByLetter([budservis, customer('1', '7 Днів'), alfa, budmarket]);

    expect(sections.map((section) => section.letter)).toEqual(['А', 'Б', 'Т', '#']);
  });
});

describe('recent customers', () => {
  it('puts the latest first without duplicates and keeps eight', () => {
    const recent = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    expect(pushRecent(recent, 'c')).toEqual(['c', 'a', 'b', 'd', 'e', 'f', 'g', 'h']);
    expect(pushRecent(recent, 'z')).toHaveLength(8);
  });
});

describe('formatKopecks', () => {
  it('shows «—» while 1C sends no debt', () => {
    expect(formatKopecks(null)).toBe('—');
    expect(formatKopecks(125050)).toMatch(/1\s250,50\s₴/);
  });
});
