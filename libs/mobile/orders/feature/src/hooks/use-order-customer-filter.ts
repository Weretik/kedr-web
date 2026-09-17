import { useGetCustomersQuery } from '@mobile/customers/data-access';
import { filterCustomersByName, type Customer } from '@mobile/customers/model';
import {
  clearOrderCustomerFilter,
  selectOrderCustomer,
  type OrderFilterSessionState,
} from '@mobile/orders/model';
import { useCallback, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  initialOrderCustomerPickerState,
  orderCustomerPickerReducer,
} from '../state/order-customer-picker-reducer';

type OrderRootState = { orderFilterSession: OrderFilterSessionState };

export function useOrderCustomerFilter() {
  const reduxDispatch = useDispatch();
  const customer = useSelector((state: OrderRootState) => state.orderFilterSession.customer);
  const [picker, pickerDispatch] = useReducer(
    orderCustomerPickerReducer,
    initialOrderCustomerPickerState,
  );
  const customersQuery = useGetCustomersQuery();

  const chooseCustomer = useCallback(
    (selected: Customer) => {
      reduxDispatch(
        selectOrderCustomer({
          counterpartyId: selected.counterpartyId,
          name: selected.name,
        }),
      );
      pickerDispatch({ type: 'selectionFinished' });
    },
    [reduxDispatch],
  );
  const clearCustomer = useCallback(() => {
    reduxDispatch(clearOrderCustomerFilter());
    pickerDispatch({ type: 'selectionFinished' });
  }, [reduxDispatch]);

  return {
    chooseCustomer,
    clearCustomer,
    customer,
    customers: filterCustomersByName(customersQuery.currentData ?? [], picker.search),
    customersQuery,
    picker,
    pickerDispatch,
  };
}
