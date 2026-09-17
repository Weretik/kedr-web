import {
  initialOrderHistoryPageState,
  orderHistoryPageReducer,
} from './order-history-page-reducer';

describe('orderHistoryPageReducer', () => {
  it('advances and resets pagination', () => {
    const next = orderHistoryPageReducer(initialOrderHistoryPageState, { type: 'nextPage' });
    expect(next.page).toBe(2);
    expect(orderHistoryPageReducer(next, { type: 'firstPage' })).toEqual(
      initialOrderHistoryPageState,
    );
  });
});
