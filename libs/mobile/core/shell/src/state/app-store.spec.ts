import { clearOrderCustomerFilter, selectOrderCustomer } from '@mobile/orders/model';

import { createAppStore } from './app-store';

describe('appStore order filter session', () => {
  it('starts with all customers, retains a selection in runtime and clears it', () => {
    const store = createAppStore();

    expect(store.getState().orderFilterSession).toEqual({});

    store.dispatch(selectOrderCustomer({ counterpartyId: 'cp-1', name: 'ТОВ Кедр' }));
    expect(store.getState().orderFilterSession.customer).toEqual({
      counterpartyId: 'cp-1',
      name: 'ТОВ Кедр',
    });

    store.dispatch(clearOrderCustomerFilter());
    expect(store.getState().orderFilterSession).toEqual({});
  });
});
