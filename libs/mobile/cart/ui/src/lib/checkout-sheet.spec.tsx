import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { CheckoutSheet } from './checkout-sheet';

const theme = { colors: { onSurface: '#111', surface: '#fff' }, dark: false };

describe('cart checkout sheets', () => {
  it('shows form errors and delegates form input and submit', () => {
    const onCommentChange = jest.fn();
    const onSubmit = jest.fn();
    const view = render(
      <PaperProvider theme={theme}>
        <CheckoutSheet
          comment="note"
          customerError="Оберіть клієнта."
          lineCount={2}
          onCommentChange={onCommentChange}
          onDismiss={jest.fn()}
          onOpenCustomerSelector={jest.fn()}
          onSubmit={onSubmit}
          submitting={false}
          total={250}
          visible
        />
      </PaperProvider>,
    );

    fireEvent.changeText(view.getByLabelText('Коментар до замовлення'), 'new note');
    fireEvent.press(view.getByLabelText('Підтвердити замовлення'));
    expect(view.getByText('Оберіть клієнта.')).toBeTruthy();
    expect(view.getByText('Клієнт *')).toBeTruthy();
    expect(view.getByText('Коментар до замовлення')).toBeTruthy();
    expect(view.getByText('2 товарних позицій · 250 грн.')).toBeTruthy();
    expect(onCommentChange).toHaveBeenCalledWith('new note');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

});
