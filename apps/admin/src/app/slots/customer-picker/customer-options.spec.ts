import { describe, expect, it } from 'vitest';

import { mergeCustomerPage, withSelectedCustomer } from './customer-options';

const customer = (counterpartyId: string, name = counterpartyId, phone: string | null = null) => ({
  counterpartyId,
  name,
  phone,
});

describe('mergeCustomerPage', () => {
  it('appends new customers in order and keeps the same array when nothing changed', () => {
    const loaded = [customer('C1'), customer('C2')];
    expect(mergeCustomerPage(loaded, [customer('C3')])).toEqual([
      customer('C1'),
      customer('C2'),
      customer('C3'),
    ]);
    expect(mergeCustomerPage(loaded, [customer('C2')])).toBe(loaded);
  });

  it('replaces a customer whose name or phone changed', () => {
    const merged = mergeCustomerPage([customer('C1', 'Старе')], [customer('C1', 'Нове', '050')]);
    expect(merged).toEqual([customer('C1', 'Нове', '050')]);
  });
});

describe('withSelectedCustomer', () => {
  it('puts the chosen customer first when the loaded pages do not have it', () => {
    expect(withSelectedCustomer([customer('C1')], customer('C9'))).toEqual([
      customer('C9'),
      customer('C1'),
    ]);
    expect(withSelectedCustomer([customer('C1')], customer('C1'))).toEqual([customer('C1')]);
    expect(withSelectedCustomer([customer('C1')], undefined)).toEqual([customer('C1')]);
  });
});
