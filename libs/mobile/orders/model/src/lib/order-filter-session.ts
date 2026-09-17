export interface OrderCustomerFilter {
  counterpartyId: string;
  name: string;
}

export interface OrderFilterSessionState {
  customer?: OrderCustomerFilter;
}

export const initialOrderFilterSessionState: OrderFilterSessionState = {};

export const clearOrderCustomerFilter = () => ({
  type: 'orderFilterSession/clearOrderCustomerFilter' as const,
});
export const selectOrderCustomer = (payload: OrderCustomerFilter) => ({
  payload,
  type: 'orderFilterSession/selectOrderCustomer' as const,
});
export type OrderFilterSessionAction =
  ReturnType<typeof clearOrderCustomerFilter> | ReturnType<typeof selectOrderCustomer>;

export function orderFilterSessionReducer(
  state: OrderFilterSessionState = initialOrderFilterSessionState,
  action: OrderFilterSessionAction | { type: string },
): OrderFilterSessionState {
  if (action.type === 'orderFilterSession/selectOrderCustomer')
    return { customer: (action as ReturnType<typeof selectOrderCustomer>).payload };
  if (action.type === 'orderFilterSession/clearOrderCustomerFilter') return {};
  return state;
}
