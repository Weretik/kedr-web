export interface OrderCustomerPickerState {
  search: string;
  visible: boolean;
}

export type OrderCustomerPickerAction =
  | { type: 'opened' }
  | { type: 'dismissed' }
  | { type: 'searchChanged'; value: string }
  | { type: 'selectionFinished' };

export const initialOrderCustomerPickerState: OrderCustomerPickerState = {
  search: '',
  visible: false,
};

export function orderCustomerPickerReducer(
  state: OrderCustomerPickerState,
  action: OrderCustomerPickerAction,
): OrderCustomerPickerState {
  switch (action.type) {
    case 'opened':
      return { search: '', visible: true };
    case 'dismissed':
    case 'selectionFinished':
      return initialOrderCustomerPickerState;
    case 'searchChanged':
      return { ...state, search: action.value };
  }
}
