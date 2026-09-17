export interface OrderHistoryPageState {
  page: number;
}

export type OrderHistoryPageAction = { type: 'nextPage' } | { type: 'firstPage' };

export const initialOrderHistoryPageState: OrderHistoryPageState = { page: 1 };

export function orderHistoryPageReducer(
  state: OrderHistoryPageState,
  action: OrderHistoryPageAction,
): OrderHistoryPageState {
  switch (action.type) {
    case 'nextPage':
      return { page: state.page + 1 };
    case 'firstPage':
      return initialOrderHistoryPageState;
  }
}
