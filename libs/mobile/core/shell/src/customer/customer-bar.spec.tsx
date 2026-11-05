import { fireEvent, render, screen } from '@testing-library/react-native';

import { CustomerBar } from './customer-bar';

describe('CustomerBar', () => {
  it('shows the customer and its price type', async () => {
    const onChange = jest.fn();
    await render(
      <CustomerBar
        customer={{ name: 'ТОВ «Будмаркет»', priceTypeName: 'Опт 2' }}
        onChange={onChange}
      />,
    );

    expect(screen.getByText('Ціни: Опт 2')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Змінити' }));
    expect(onChange).toHaveBeenCalled();
  });

  it('asks to choose a customer when none is chosen', async () => {
    await render(<CustomerBar customer={null} onChange={jest.fn()} />);

    expect(screen.getByText('Клієнта не обрано')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Обрати' })).toBeTruthy();
  });
});
