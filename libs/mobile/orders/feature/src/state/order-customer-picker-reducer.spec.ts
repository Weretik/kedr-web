import {
  initialOrderCustomerPickerState,
  orderCustomerPickerReducer,
} from './order-customer-picker-reducer';

describe('orderCustomerPickerReducer', () => {
  it('opens with a clean search and clears state after dismissal or selection', () => {
    const open = orderCustomerPickerReducer({ search: 'кедр', visible: false }, { type: 'opened' });
    expect(open).toEqual({ search: '', visible: true });
    expect(orderCustomerPickerReducer(open, { type: 'dismissed' })).toEqual(
      initialOrderCustomerPickerState,
    );
    expect(orderCustomerPickerReducer(open, { type: 'selectionFinished' })).toEqual(
      initialOrderCustomerPickerState,
    );
  });

  it('updates the local search value', () => {
    expect(
      orderCustomerPickerReducer(initialOrderCustomerPickerState, {
        type: 'searchChanged',
        value: 'кедр',
      }).search,
    ).toBe('кедр');
  });
});
