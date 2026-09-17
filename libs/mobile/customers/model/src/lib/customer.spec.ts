import { filterCustomersByName, type Customer } from './customer';

const customers: Customer[] = [
  { counterpartyId: '1', name: 'Клієнт Перший', phone: null },
  { counterpartyId: '2', name: 'Інший покупець', phone: '+380501234567' },
  { counterpartyId: '3', name: 'Другий КЛІЄНТ', phone: null },
];

describe('customer name search', () => {
  it('returns all customers for an empty normalized query', () => {
    expect(filterCustomersByName(customers, '   ')).toEqual(customers);
  });

  it('matches a trimmed query without regard to case', () => {
    expect(filterCustomersByName(customers, '  кліЄнТ ')).toEqual([customers[0], customers[2]]);
  });

  it('returns an empty collection when no name matches', () => {
    expect(filterCustomersByName(customers, 'відсутній')).toEqual([]);
  });
});
