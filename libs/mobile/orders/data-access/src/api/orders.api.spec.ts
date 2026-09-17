import {
  buildOrderDetailRequest,
  buildOrderHistoryRequest,
  ORDER_HISTORY_PAGE_SIZE,
} from './orders.requests';

describe('orders API requests', () => {
  it('builds an unfiltered first-page request', () => {
    expect(buildOrderHistoryRequest({ page: 1 })).toEqual({
      method: 'GET',
      params: { page: 1, pageSize: ORDER_HISTORY_PAGE_SIZE },
      url: '/api/admin/orders',
    });
  });

  it('trims and sends an exact selected counterparty ID', () => {
    expect(buildOrderHistoryRequest({ counterpartyId: ' cp-1 ', page: 2 })).toEqual({
      method: 'GET',
      params: { counterpartyId: 'cp-1', page: 2, pageSize: ORDER_HISTORY_PAGE_SIZE },
      url: '/api/admin/orders',
    });
  });

  it('omits an empty counterparty filter', () => {
    expect(buildOrderHistoryRequest({ counterpartyId: '  ', page: 1 }).params).toEqual({
      page: 1,
      pageSize: ORDER_HISTORY_PAGE_SIZE,
    });
  });

  it('builds one detail request', () => {
    expect(buildOrderDetailRequest(42)).toEqual({ method: 'GET', url: '/api/admin/orders/42' });
  });
});
