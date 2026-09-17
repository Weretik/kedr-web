import {
  clearOrderCustomerFilter,
  initialOrderFilterSessionState,
  orderFilterSessionReducer,
  selectOrderCustomer,
} from './order-filter-session';

describe('orderFilterSessionReducer', () => {
  it('starts with all customers and keeps only selected identity', () => {
    expect(initialOrderFilterSessionState).toEqual({});
    expect(
      orderFilterSessionReducer(
        undefined,
        selectOrderCustomer({ counterpartyId: 'cp-1', name: 'Кедр' }),
      ),
    ).toEqual({ customer: { counterpartyId: 'cp-1', name: 'Кедр' } });
  });

  it('clears the customer filter', () => {
    expect(
      orderFilterSessionReducer(
        { customer: { counterpartyId: 'cp-1', name: 'Кедр' } },
        clearOrderCustomerFilter(),
      ),
    ).toEqual({});
  });
});
